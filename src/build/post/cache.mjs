/* Purges Cloudflare after a deploy, then proves the purge worked.

   The failure mode this guards (seen Aug 19, 2026): App Platform flips
   deployments non-atomically, so for a couple of minutes a request can get
   the new HTML while an origin node still serves the old file set. The
   asset request 404s, and because every response carries s-maxage=86400,
   Cloudflare pins that 404 for a day. The page then references an _app
   chunk the edge swears doesn't exist, hydration never runs, and the site
   spins — only in production, only in the colos that cached the miss.

   Fixed waits can't cover a window whose length App Platform controls, so
   after the blanket purges this reads the HTML actually being served,
   requests every asset it references (the /_next/ chunks and any
   same-origin src, like page images) through the same edge, purges
   exactly the URLs that 404, and repeats until clean. If the edge never
   heals, the throw fails the POST_DEPLOY job and trips the
   DEPLOYMENT_FAILED alert.

   That loop alone is not enough, and the reason is an asymmetry worth
   stating plainly, because it is what let the Aug 21 recurrence through:

     - Detection is colo-local. This job reaches exactly one of Cloudflare's
       hundreds of datacentres, and findBrokenAssets can only ever report on
       that one. A 404 pinned in any other colo is invisible here.
     - Purging is zone-wide. purge_cache by URL evicts an entry from every
       colo at once.

   So a clean read is not a reason to skip the purge — it is the moment the
   purge becomes both safe and necessary. Safe, because a pass where every
   referenced URL resolves is the proof that the origin has finished
   flipping, so nothing can re-cache a 404 afterwards. Necessary, because
   the colos this job cannot see are precisely the ones nobody is checking.
   healBrokenAssets therefore ends by purging the whole referenced set
   unconditionally, which is a couple of dozen URLs — one API call — rather
   than only the subset that happened to be broken on this edge.

   By URL rather than a third purge_everything: the set is small and exact,
   and dumping the entire zone would send every image, font and page to the
   origin at once for no added coverage. */

import { SITE_PAGES } from '../sitemap.mjs';

/* The noindex pages the sitemap cannot carry but the heal must: /login/,
   /my/, and the two OAuth callbacks are the sign-in path, whose whole
   content is the same four-box loader — a chunk the edge has 404'd
   leaves them on that loader forever, and the redirect that should
   replace it only happens once React hydrates. */
const AUTH_PAGES = [
  '/login/',
  '/my/',
  '/auth/callback/',
  '/oauth/mlh/callback/',
];

/* Every page the heal loop walks. The public half comes straight from
   the sitemap, so LAUNCHING A PAGE NEEDS NO CHANGE HERE — adding it to
   SITE_PAGES in src/build/sitemap.mjs (which every public page must do
   anyway) enrols it in the post-deploy verification automatically. The
   /sponsor launch (Aug 25, 2026) shipped outside this list and its
   launch-window 404s were invisible to the heal; deriving the list is
   what keeps that from repeating. Exported for the test that pins the
   derivation. */
export const VERIFY_PAGES = [...SITE_PAGES, ...AUTH_PAGES];

/* Cloudflare caps purge-by-URL requests at 30 files each. */
const PURGE_FILES_LIMIT = 30;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const purgeRequest = async (payload) => {
  // Do the purge
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(
      process.env.CLOUDFLARE_ZONE_ID,
    )}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    },
  );

  // Check the response
  const body = await resp.text().catch(() => '');
  if (!resp.ok)
    throw new Error(
      `Cloudflare API error: ${resp.status} ${resp.statusText}: ${body}`,
    );
  console.log(
    `Cloudflare API response: ${resp.status} ${resp.statusText}: ${body}`,
  );
};

const purge = () => purgeRequest({ purge_everything: true });

const purgeFiles = async (files) => {
  for (let i = 0; i < files.length; i += PURGE_FILES_LIMIT) {
    await purgeRequest({ files: files.slice(i, i + PURGE_FILES_LIMIT) });
  }
};

/* Every URL a served page depends on: the hashed /_next/ chunks and
   stylesheets, plus anything a src attribute references from our own
   origin — page images fail exactly like chunks when a deploy-window
   404 gets pinned (Aug 25, 2026: two /sponsors/*.svg logos stayed 404
   through a colo after the origin had settled, because this matched
   only /_next/). Root-relative paths only: off-origin and
   protocol-relative URLs are not ours to verify or purge, and data:
   URIs never hit the network. */
export const extractAssetPaths = (html) => [
  ...new Set([
    ...(html.match(/\/_next\/[^"'\s>]+/g) ?? []),
    ...[...html.matchAll(/\ssrc="(\/[^/"][^"]*)"/g)].map(([, path]) => path),
  ]),
];

/* One pass over the served pages, reporting both halves of what the caller
   needs: which URLs this edge is 404ing, and every URL the pages consist of.

   `referenced` carries the page URLs as well as their assets. Cloudflare
   does not currently cache the HTML — it answers DYNAMIC, since .html is
   not in its default cacheable set — so purging those is a no-op today. It
   is included anyway because the day a cache rule starts caching HTML is
   not the day anyone will remember to revisit this, and a stale page is
   just as fatal as a stale chunk. A page that did not answer 200 stays in
   the set for the same reason: its own cached copy is the likeliest thing
   to be wrong. */
export const inspectPages = async ({ origin, pages, fetchImpl }) => {
  const broken = [];
  const referenced = [];
  const seen = new Set();

  /* False when this URL has already been accounted for, which is also what
     keeps a shared chunk from being requested once per page. */
  const remember = (url) => {
    if (seen.has(url)) return false;
    seen.add(url);
    referenced.push(url);
    return true;
  };

  for (const pagePath of pages) {
    const pageUrl = new URL(pagePath, origin).href;
    remember(pageUrl);

    const pageResp = await fetchImpl(pageUrl);
    if (!pageResp.ok) {
      broken.push(pageUrl);
      continue;
    }

    for (const assetPath of extractAssetPaths(await pageResp.text())) {
      const assetUrl = new URL(assetPath, origin).href;
      if (!remember(assetUrl)) continue;

      /* HEAD keeps the check cheap but still reflects (and populates) the
         same edge cache entry a browser's GET would hit. */
      const assetResp = await fetchImpl(assetUrl, { method: 'HEAD' });
      if (assetResp.status === 404) broken.push(assetUrl);
    }
  }

  return { broken, referenced };
};

export const findBrokenAssets = async (args) =>
  (await inspectPages(args)).broken;

export const healBrokenAssets = async ({
  origin,
  pages,
  attempts = 10,
  fetchImpl = fetch,
  sleepImpl = () => sleep(30000),
  purgeImpl = purgeFiles,
}) => {
  let broken = [];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const pass = await inspectPages({ origin, pages, fetchImpl });
    broken = pass.broken;

    if (broken.length === 0) {
      /* The clean pass proves the origin has settled. Purge everything
         these pages are made of, so the colos this job never reaches
         cannot still be holding a 404 from the flip — see the note at the
         top of this file. */
      await purgeImpl(pass.referenced);
      console.log(
        `Verified ${pages.join(', ')}: every referenced asset resolves; purged ${
          pass.referenced.length
        } URL(s) zone-wide`,
      );
      return;
    }

    console.warn(
      `Attempt ${attempt}/${attempts}: ${broken.length} URL(s) still 404 through the edge, purging: ${broken.join(', ')}`,
    );
    await purgeImpl(broken);
    await sleepImpl();
  }

  throw new Error(
    `Edge still serving 404s after ${attempts} purge attempts: ${broken.join(', ')}`,
  );
};

const cache = async () => {
  // Check we have the env vars we need
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.warn('CLOUDFLARE_API_TOKEN not set, cannot clear Cloudflare cache');
    return;
  }
  if (!process.env.CLOUDFLARE_ZONE_ID) {
    console.warn('CLOUDFLARE_ZONE_ID not set, cannot clear Cloudflare cache');
    return;
  }

  // Do a purge after waiting 30s to give the site time to deploy
  await sleep(30000);
  await purge();

  // Wait 30s for the initial purge to complete, and then purge again to be safe
  await sleep(30000);
  await purge();

  /* The blanket purges only help if the origin has finished flipping;
     keep checking the served pages until their assets actually resolve,
     then purge the whole referenced set for the colos this job cannot
     see. */
  await healBrokenAssets({
    origin: process.env.BASE_URL || 'https://hacktoberfest.com',
    pages: VERIFY_PAGES,
  });
};

export default cache;
