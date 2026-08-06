import { writeFile } from 'fs/promises';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const sitemap = async () => {
  // Define the sitemap URLs
  const urls = [
    {
      url: '/',
      lastmod: new Date().toISOString(),
      priority: 1,
      changefreq: 'daily',
    },
  ];

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
