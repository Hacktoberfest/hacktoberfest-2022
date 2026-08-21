import buildMode from './buildMode.mjs';
import cache from './cache.mjs';

const main = async () => {
  /* Fatal, and should be: it records what mode this build baked, and
     scripts/check-build-mode.mjs refuses to serve a build whose record
     disagrees with it. A build we cannot describe is not one to ship. */
  await buildMode();

  /* Never fatal, and this is the whole lesson of Aug 21, 2026.

     `postbuild` is an npm lifecycle hook, so it does not only run in the
     POST_DEPLOY job that was written for it — it also runs at the end of
     `npm run build`, which is the static site's build command. Anything
     that throws in here therefore fails the *build*, before the new version
     has gone anywhere.

     That turned a cache check into a trap. hacktoberfest.com is served by
     two App Platform apps, hacktoberfest-production-nyc and
     hacktoberfest-production-sfo, and they build separately. One built
     successfully and went to the new commit; the other's build ran the
     check, saw an origin now serving two different builds, threw, and
     failed. So it stayed on the old commit — which is exactly the split the
     check had just complained about, now made permanent. Every build
     afterwards found the same split and failed the same way. The check
     caused the condition it refused to pass, and nothing could ever deploy
     again.

     Deploying is also the only thing that can end a split, so this step must
     never be the reason a deploy does not happen. It purges when it can and
     complains when it cannot, and the build ships either way. A missed purge
     costs stale assets for a while; a build that cannot run costs everything
     downstream of it, including the fix. */
  try {
    await cache();
  } catch (error) {
    console.warn(
      '\n!! Cache step failed. The build is NOT failed for this — see the note in src/build/post/index.mjs.',
    );
    console.warn(`!! ${error && error.stack ? error.stack : error}\n`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
