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
   DEPLOYMENT_FAILED alert.

   That loop alone is not enough, and there are two reasons, one of which
   was a wrong assumption written down here.

   First, an asymmetry. Detection is colo-local: this job reaches exactly one
   of Cloudflare's hundreds of datacentres, and inspectPages can only ever
   report on that one, so a 404 pinned in any other colo is invisible here.
   Purging is zone-wide: purge_cache by URL evicts an entry everywhere at
   once. So a clean read is not a reason to skip the purge. healBrokenAssets
   ends by purging the whole referenced set unconditionally, a couple of
   dozen URLs and one API call, rather than only the subset that happened to
   be broken on this edge.

   Second, and this is the part that was wrong: that clean read was claimed
   here as "proof that the origin has finished flipping, so nothing can
   re-cache a 404 afterwards". It is not. hacktoberfest.com answers from more
   than one App Platform node (x-do-app-origin tells them apart), they do not
   flip together, and a read through one edge only ever samples whichever
   node that colo drew. On Aug 21, 2026 the job read clean, purged, and
   exited; about a minute later DEL refilled its cache, drew the lagging node
   for /my's CSS module bundle, and pinned that 404 for a day. /my hydrated
   perfectly and rendered as unstyled blocks, since a missing stylesheet does
   not stop React the way a missing chunk does.

   Worse, the blanket purge was the loaded gun. Emptying the zone obliges
   every colo on earth to refill from the origin, so doing it on a timer
   during the flip aims the whole world at a node that may still be missing
   files. Left alone, DEL would have served its perfectly good pre-deploy
   cache until the origin had settled.

   Hence the order below: prove, then purge. awaitOriginConsistency polls the
   origin directly, past the edge, until every node it answers with has
   served every referenced URL; only then is anything evicted. A genuine
   non-200 throws, fails the POST_DEPLOY job and trips DEPLOYMENT_FAILED.

   None of this makes the 404s themselves cheap: they are cacheable for a day
   because App Platform stamps s-maxage=86400 on them, which nothing in this
   repo can change. The real fix is a Cloudflare cache rule capping edge TTL
   for 4xx, and it needs zone access this project does not have. Everything
   here is mitigation until that exists. */

/* Every page whose visible behaviour is a client-side effect, so a chunk
   the edge has 404'd leaves it on a loader forever rather than merely
   costing it interactivity. /login/ and the two OAuth callbacks are the
   sign-in path and fail exactly like /my: their whole content is the same
   four-box loader, and the redirect that should replace it only happens
   once React hydrates. */
const VERIFY_PAGES = [
  '/',
  '/host/',
  '/login/',
  '/my/',
  '/auth/callback/',
  '/oauth/mlh/callback/',
];

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

/* A query string Cloudflare has never seen cannot be answered from its
   cache, so the request goes to the origin. Everything below depends on
   that: the whole point is to ask the origin what it has, rather than to
   ask one colo what it happens to be holding. */
const bustUrl = (url, token) => {
  const parsed = new URL(url);
  parsed.searchParams.set('__deploycheck', token);
  return parsed.href;
};

/* Unique per run, and that is load-bearing rather than tidy. A token reused
   between deploys is not a cache-buster at all: the previous deploy left a
   cache entry under it, and if what it left was a 404 — the exact thing this
   check exists to catch — then s-maxage pins it for a day and every later
   deploy grades a stale miss from the last one. Rounds append to this, so
   no two requests anywhere share a URL. */
const freshToken = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/* The referenced set, read past the edge. inspectPages reads whatever this
   colo holds, which is the right question when healing it and the wrong one
   when establishing what the origin is currently serving. */
export const readReferencedUrls = async ({
  origin,
  pages,
  fetchImpl = fetch,
  token,
}) => {
  const urls = [];
  const seen = new Set();

  const remember = (url) => {
    if (seen.has(url)) return;
    seen.add(url);
    urls.push(url);
  };

  for (const pagePath of pages) {
    const pageUrl = new URL(pagePath, origin).href;
    remember(pageUrl);

    const resp = await fetchImpl(bustUrl(pageUrl, token));
    if (!resp.ok) continue;

    for (const assetPath of extractAssetPaths(await resp.text())) {
      remember(new URL(assetPath, origin).href);
    }
  }

  return urls;
};

/* One pass over every URL, straight to the origin, recording which node
   answered. App Platform reports that in x-do-app-origin, and it is the
   header this whole check turns on: hacktoberfest.com sits on more than one
   node, they do not flip together, and a 404 from one of them is invisible
   to anyone who only ever talks to the other. */
export const sampleOrigins = async ({ urls, fetchImpl = fetch, token }) => {
  const results = [];

  for (const url of urls) {
    const resp = await fetchImpl(bustUrl(url, token), { method: 'HEAD' });
    results.push({
      url,
      status: resp.status,
      origin: resp.headers?.get?.('x-do-app-origin') ?? null,
    });
  }

  return results;
};

/* Blocks until the origin is serving the same build from every node it
   answers with, so that purging afterwards refills the edge from something
   consistent.

   This is the gate the Aug 21 recurrence went through. The job used to
   purge on a timer and verify afterwards; it now proves first and purges
   second, because a blanket purge during the flip is what turns one lagging
   node into a pinned 404 in whichever colos happen to refill at that
   moment.

   Two conditions, and the difference between them matters:

     - Every URL answered 200 for `cleanRounds` rounds running. A single
       non-200 anywhere resets the count, because that is the lagging node
       being caught.
     - Every node seen has served every URL at least once. Rounds alone can
       pass while a bad node is simply never routed to; coverage is what
       makes the first condition mean something.

   Coverage is required but not enforced on pain of failure. Never reaching
   a second node is not evidence of a broken one, and blocking a release on
   routing this job does not control would trade a rare bad deploy for a
   frequent stuck one. So an uncovered-but-clean origin warns and proceeds,
   while an actual non-200 still throws and trips DEPLOYMENT_FAILED. */
export const awaitOriginConsistency = async ({
  urls,
  fetchImpl = fetch,
  sleepImpl = () => sleep(5000),
  attempts = 40,
  cleanRounds = 3,
  token = freshToken(),
}) => {
  const served = new Map(); // node → the URLs it has answered 200 for
  const origins = new Set(); // every node that has answered at all
  let clean = 0;
  let broken = [];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const results = await sampleOrigins({
      urls,
      fetchImpl,
      /* Fresh every round, on top of a token unique to this run. Within a
         run, a repeated token would be served from the edge entry the
         previous round created and the check would grade its own cached
         answer; across runs, see freshToken. */
      token: `${token}-${attempt}`,
    });

    broken = results.filter(({ status }) => status !== 200);

    for (const { url, status, origin } of results) {
      if (!origin) continue;
      origins.add(origin);
      if (status !== 200) continue;
      if (!served.has(origin)) served.set(origin, new Set());
      served.get(origin).add(url);
    }

    clean = broken.length === 0 ? clean + 1 : 0;

    const covered =
      origins.size > 0 &&
      [...origins].every((node) => served.get(node)?.size === urls.length);

    if (clean >= cleanRounds && covered) {
      console.log(
        `Origin consistent: ${urls.length} URL(s) served by every node (${[...origins].join(', ')})`,
      );
      return { origins, covered: true };
    }

    await sleepImpl();
  }

  if (broken.length > 0) {
    throw new Error(
      `Origin still inconsistent after ${attempts} rounds: ${broken
        .map(({ url, status, origin }) => `${url} → ${status} from ${origin}`)
        .join(', ')}`,
    );
  }

  console.warn(
    `Origin answered 200 for every URL, but ${attempts} rounds never routed every node (${[...origins].join(', ')}) to every URL. Proceeding.`,
  );
  return { origins, covered: false };
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

  const origin = process.env.BASE_URL || 'https://hacktoberfest.com';

  // Give the deployment a moment to land before asking it anything.
  await sleep(30000);

  /* Everything the verified pages are made of, read from the origin rather
     than from this colo's cache, so the list is the build actually being
     served and not one this edge is still holding. */
  const referenced = await readReferencedUrls({
    origin,
    pages: VERIFY_PAGES,
    token: freshToken(),
  });

  /* The gate, and the ordering that matters. This used to purge at +30s and
     +60s and verify afterwards, which had it exactly backwards: a blanket
     purge empties the zone and obliges every colo on earth to refill from
     the origin, so doing it mid-flip aims the whole world at a node that
     may still be missing files. On Aug 21 that is precisely what happened —
     DEL refilled nine minutes after the deploy, drew the lagging node for
     /my's stylesheet, and pinned the 404 for a day. Prove first, purge
     second. */
  await awaitOriginConsistency({ urls: referenced });

  /* One blanket purge, now that the origin can actually answer it. Kept
     despite being blunter than purging `referenced`, because /public assets
     keep their filenames across builds: a replaced image has the same URL
     and this is the only thing that evicts it. */
  await purge();

  /* And the edge check, unchanged in what it does but no longer racing the
     flip: it reports on this one colo, purging by URL for every colo it
     cannot see, and ends by purging the whole referenced set. */
  await healBrokenAssets({ origin, pages: VERIFY_PAGES });
};

export default cache;
