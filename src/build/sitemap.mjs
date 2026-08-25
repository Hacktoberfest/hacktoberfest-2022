import { writeFile } from 'fs/promises';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

/* Every public page, in one place. The sitemap is generated from this
   list, and so is the post-deploy cache heal (src/build/post/cache.mjs):
   each page here is fetched through the edge after a deploy, its
   referenced assets are checked, and everything gets purged zone-wide,
   so a launch-window 404 cannot stay pinned in a colo for a day (the
   /sponsor launch, Aug 25 2026, shipped without joining the heal list
   and did exactly that). Launching a page means adding it here; the
   sitemap and the heal both follow. Pages that must stay out of the
   sitemap (the sign-in path) are verified via AUTH_PAGES in cache.mjs
   instead. */
export const SITE_PAGES = ['/', '/host/', '/sponsor/', '/questions/'];

const sitemap = async () => {
  // Define the sitemap URLs
  const urls = SITE_PAGES.map((url) => ({
    url,
    lastmod: new Date().toISOString(),
    priority: url === '/' ? 1 : 0.8,
    changefreq: url === '/' ? 'daily' : 'weekly',
  }));

  // Create the sitemap generation stream
  const stream = new SitemapStream({ hostname: BASE_URL });

  // Write the URLs and get the sitemap data
  Readable.from(urls).pipe(stream);
  const sitemap = await streamToPromise(stream).then((data) => data.toString());

  // Write the sitemap out
  await writeFile(
    new URL('../../public/sitemap.xml', import.meta.url),
    sitemap,
  );
};

export default sitemap;
