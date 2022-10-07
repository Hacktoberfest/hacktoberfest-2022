import cache from './cache.mjs';

const main = async () => {
  await cache();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
