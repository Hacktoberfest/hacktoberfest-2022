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
   requests every /_next/ asset it references through the same edge, purges
   exactly the URLs that 404, and repeats until clean. If the edge never
   heals, the throw fails the POST_DEPLOY job and trips the
   DEPLOYMENT_FAILED alert. */

const VERIFY_PAGES = ['/', '/host/', '/login/', '/my/'];

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

export const extractAssetPaths = (html) => [
  ...new Set(html.match(/\/_next\/[^"'\s>]+/g) ?? []),
];

export const findBrokenAssets = async ({ origin, pages, fetchImpl }) => {
  const broken = [];
  const checked = new Set();

  for (const pagePath of pages) {
    const pageUrl = new URL(pagePath, origin).href;
    const pageResp = await fetchImpl(pageUrl);
    if (!pageResp.ok) {
      broken.push(pageUrl);
      continue;
    }

    for (const assetPath of extractAssetPaths(await pageResp.text())) {
      const assetUrl = new URL(assetPath, origin).href;
      if (checked.has(assetUrl)) continue;
      checked.add(assetUrl);

      /* HEAD keeps the check cheap but still reflects (and populates) the
         same edge cache entry a browser's GET would hit. */
      const assetResp = await fetchImpl(assetUrl, { method: 'HEAD' });
      if (assetResp.status === 404) broken.push(assetUrl);
    }
  }

  return broken;
};

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
    broken = await findBrokenAssets({ origin, pages, fetchImpl });
    if (broken.length === 0) {
      console.log(
        `Verified ${pages.join(', ')}: every referenced asset resolves`,
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
     keep checking the served pages until their assets actually resolve. */
  await healBrokenAssets({
    origin: process.env.BASE_URL || 'https://hacktoberfest.com',
    pages: VERIFY_PAGES,
  });
};

export default cache;
