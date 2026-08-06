import { siteMeta } from './content.mjs';

// Social crawlers reject relative image paths, so absolute URLs are built
// from BASE_URL (set at build time, same as the sitemap and robots.txt).
const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

export const absoluteUrl = (path) => `${BASE_URL}${path}`;

export const meta = {
  // Title and description also feed llms.txt, so they live with the copy.
  ...siteMeta,
  url: absoluteUrl('/'),
  // 1.91:1 for Open Graph, 16:9 for Twitter's large summary card.
  image: absoluteUrl('/og-image.png'),
  imageWide: absoluteUrl('/og-image-16x9.png'),
};
