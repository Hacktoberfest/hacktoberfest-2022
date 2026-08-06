import llms from './llms.mjs';
import robots from './robots.mjs';
import sitemap from './sitemap.mjs';

const main = async () => {
  await sitemap();
  await robots();
  await llms();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
