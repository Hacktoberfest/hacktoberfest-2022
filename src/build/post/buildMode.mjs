import { writeFile } from 'fs/promises';

/* `NEXT_PUBLIC_API_BASE_URL` is inlined into the client bundle at build time,
   and it is the single switch between the mocked build and the live one. That
   makes the mode a property of `out/`, not of the shell you later run
   `npm start` in — and nothing about a built page says which mode it is.

   The trap that motivated this: `npm run test:integration` runs `npm run
   build`, so running the test suite silently rebuilds `out/` with whatever
   the environment happens to hold. A live build becomes a mocked one, the
   sign-in button quietly stops redirecting to MyMLH and writes a fixture
   session instead, and the only symptom is "why am I seeing mock data".

   So the build records what it baked, and `prestart` compares it against the
   environment being used to serve. See scripts/check-build-mode.mjs. */
export const BUILD_MODE_FILE = new URL(
  '../../../.build-mode.json',
  import.meta.url,
);

const buildMode = async () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || null;

  await writeFile(
    BUILD_MODE_FILE,
    `${JSON.stringify({ apiBaseUrl }, null, 2)}\n`,
  );

  console.info(
    apiBaseUrl
      ? `Build mode: LIVE — the client will call ${apiBaseUrl}`
      : 'Build mode: MOCKED — no backend required, /my serves fixtures',
  );
};

export default buildMode;
