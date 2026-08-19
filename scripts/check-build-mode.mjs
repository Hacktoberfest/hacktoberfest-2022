/* Runs as `prestart`. Refuses to serve a build whose baked mode contradicts
   the environment you are serving it with, and otherwise says which mode you
   are about to get.

   Deliberately NOT "refuse unless an API base URL is set": the mocked build
   is a supported, documented way to run this site with no backend at all.
   The failure worth catching is the *mismatch* — asking for one mode and
   silently getting the other, which is what `npm run test:integration`
   rebuilding `out/` causes. See src/build/post/buildMode.mjs. */
import { readFile } from 'fs/promises';

const ROOT = new URL('../', import.meta.url);
const MODE_FILE = new URL('.build-mode.json', ROOT);
const OUT_INDEX = new URL('out/index.html', ROOT);

const describe = (url) =>
  url ? `LIVE (calling ${url})` : 'MOCKED (fixtures, no backend)';

const die = (lines) => {
  console.error(`\n  Refusing to serve.\n\n${lines.join('\n')}\n`);
  process.exit(1);
};

const rebuildHint = (wanted) =>
  wanted
    ? `      NEXT_PUBLIC_API_BASE_URL=${wanted} BASE_URL=https://hacktoberfest.com npm run build`
    : '      BASE_URL=https://hacktoberfest.com npm run build';

const read = async (url) => {
  try {
    return await readFile(url, 'utf8');
  } catch (_) {
    return null;
  }
};

const main = async () => {
  if (!(await read(OUT_INDEX))) {
    die([
      '  There is no build in out/ yet. Build first:',
      '',
      rebuildHint(process.env.NEXT_PUBLIC_API_BASE_URL || ''),
    ]);
  }

  const raw = await read(MODE_FILE);
  if (!raw) {
    die([
      '  out/ was built before this check existed, so its mode is unknown.',
      '  Rebuild so the mode is recorded:',
      '',
      rebuildHint(process.env.NEXT_PUBLIC_API_BASE_URL || ''),
    ]);
  }

  let built;
  try {
    built = JSON.parse(raw).apiBaseUrl || null;
  } catch (_) {
    die(['  .build-mode.json is unreadable. Rebuild to regenerate it.']);
  }

  const wanted = process.env.NEXT_PUBLIC_API_BASE_URL || null;

  if (built !== wanted) {
    die([
      `  The build in out/ is ${describe(built)},`,
      `  but you are starting it as ${describe(wanted)}.`,
      '',
      '  A static export bakes NEXT_PUBLIC_API_BASE_URL in at build time, so',
      '  setting it now changes nothing — the sign-in button would take the',
      '  wrong branch and you would silently get the wrong data.',
      '',
      '  Note that `npm test` runs `npm run build`, so running the suite',
      '  rebuilds out/ with whatever the environment held at the time.',
      '',
      '  Rebuild for the mode you want:',
      '',
      rebuildHint(wanted || ''),
    ]);
  }

  console.info(`  Serving the ${describe(built)} build.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
