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
    // {
    //   url: '/participation',
    //   lastmod: new Date().toISOString(),
    //   priority: 0.9,
    //   changefreq: 'daily',
    // },
    // {
    //   url: '/events',
    //   lastmod: new Date().toISOString(),
    //   priority: 0.8,
    //   changefreq: 'daily',
    // },
    // {
    //   url: '/about',
    //   lastmod: new Date().toISOString(),
    //   priority: 0.7,
    //   changefreq: 'daily',
    // },
    // {
    //   url: '/donate',
    //   lastmod: new Date().toISOString(),
    //   priority: 0.6,
    //   changefreq: 'daily',
    // },
    // {
    //   url: '/report',
    //   lastmod: new Date().toISOString(),
    //   priority: 0.5,
    //   changefreq: 'daily',
    // },
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
