import { readdir, rm, stat } from 'fs/promises';

import { CLOSED_ROUTES } from '../../data/closedRoutes.mjs';

/* Deletes closed routes out of the finished export.

   Next builds every file under src/pages, so a route can only be closed
   after the fact. Unlinking it is not enough — the URL would still answer
   200, and the page's chunk would still carry its copy and fixtures to
   anyone reading `_next/`. So both go: the exported directory, and the page
   chunk Next named after it. What's left is a URL that serves the site's own
   404, with the page's source untouched in the repo.

   Deliberately loud. A closed route that has already stopped being built is
   a stale entry in data/closedRoutes.mjs, and silence there would leave the
   list looking like it was doing something. */

const OUT_DIR = new URL('../../../out/', import.meta.url);
const CHUNK_DIR = new URL('_next/static/chunks/pages/', OUT_DIR);

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const exists = async (url) =>
  stat(url).then(
    () => true,
    () => false,
  );

/* '/fests/' → 'fests'. One segment only: a nested route's chunk lives in a
   subdirectory of CHUNK_DIR, and guessing at that is how you delete the
   wrong file. Throwing keeps the guess from being made. */
const segmentFor = (route) => {
  const segment = route.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.includes('/')) {
    throw new Error(
      `closedRoutes: "${route}" is not a single-segment route; teach the pruner where Next puts its chunk before closing it`,
    );
  }
  return segment;
};

/* The page's own chunk, matched on Next's `<name>-<contenthash>.js` shape.
   Anchored at both ends on purpose: `out/fests-hack-day.jpg` is a public
   asset /my renders, and a loose prefix match would take it. */
const chunksFor = async (segment) => {
  const pattern = new RegExp(
    `^${escapeRegExp(segment)}-[0-9a-f]+\\.js(\\.map)?$`,
  );
  const entries = await readdir(CHUNK_DIR).catch(() => []);
  return entries.filter((entry) => pattern.test(entry));
};

const closeRoute = async (route) => {
  const segment = segmentFor(route);
  const removed = [];

  const pageDir = new URL(`${segment}/`, OUT_DIR);
  if (await exists(pageDir)) {
    await rm(pageDir, { recursive: true, force: true });
    removed.push(`out/${segment}/`);
  }

  for (const chunk of await chunksFor(segment)) {
    await rm(new URL(chunk, CHUNK_DIR), { force: true });
    removed.push(`out/_next/static/chunks/pages/${chunk}`);
  }

  if (removed.length === 0) {
    console.warn(
      `Closed route ${route}: nothing to remove — is data/closedRoutes.mjs stale?`,
    );
    return;
  }

  console.info(`Closed route ${route}: removed ${removed.join(', ')}`);
};

const closedRoutes = async () => {
  for (const route of CLOSED_ROUTES) {
    await closeRoute(route);
  }
};

export default closedRoutes;
