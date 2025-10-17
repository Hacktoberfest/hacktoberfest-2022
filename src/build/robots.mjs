import { writeFile } from 'fs/promises';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const robots = async () => {
  await writeFile(
    new URL('../../public/robots.txt', import.meta.url),
    `User-agent: *\nDisallow: /auth\nSitemap: ${BASE_URL}/sitemap.xml`,
  );
};

export default robots;
