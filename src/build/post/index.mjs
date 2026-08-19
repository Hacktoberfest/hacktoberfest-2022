import buildMode from './buildMode.mjs';
import cache from './cache.mjs';

const main = async () => {
  await buildMode();
  await cache();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
