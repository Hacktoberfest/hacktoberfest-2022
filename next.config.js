const childProcess = require('child_process');
const nextLog = require('next/dist/build/output/log');
const { EnvironmentPlugin } = require('webpack');

const getBuildId = () => {
  // Prefer BUILD_ID env var if available
  if (process.env.BUILD_ID !== undefined) return process.env.BUILD_ID;

  // Attempt to get current git sha
  try {
    return childProcess.execSync('git rev-parse HEAD').toString().trim();
  } catch (_) {
    // Ignore any error
  }

  // Default to Next's own generation
  return null;
};

/* Hands webpack the client entries sorted by name, so two builds of one
   commit emit the same files.

   Next does not: it resolves every page's entry after an async read of
   the page file, all at once, so the entry object's key order is whatever
   order those reads happened to finish in, and it varies run to run on one
   machine. Most output does not care. CSS does: when pages import the same
   CSS modules in conflicting orders (/my/fest reaches PageHero before
   Header's TodayStrip, the other /my pages the reverse),
   mini-css-extract-plugin settles the shared stylesheet's order by
   whichever page's entry came first, and the order is in the content
   hash, so it is in the filename.

   That only matters because production is two App Platform apps building
   the same commit separately. On Oct 19, 2026 they disagreed: each app's
   /my HTML linked its own name for the shared stylesheet, the other app
   404'd that name half the time, Cloudflare pinned the 404, and /my drew
   unstyled (PageHero's corner geometry at full page width) until the
   asset-retry script in _document.js fetched it past the edge.

   Plain sort() rather than localeCompare: code-unit order is the same on
   every machine, and a locale-dependent comparison would just be another
   way for the two builds to differ. */
const sortedEntries = (entry) => async () => {
  const entries = await (typeof entry === 'function' ? entry() : entry);
  return Object.fromEntries(
    Object.keys(entries)
      .sort()
      .map((name) => [name, entries[name]]),
  );
};

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: true,
      cssProp: true,
      minify: true,
      /* Must stay on (its default). Turning it off does not leave the
         template literals alone: SWC still lowers them for the client
         target, but without this transform the CSS text never makes it
         into the lowered form, so every styled-components template in
         every client chunk ships as `_tagged_template_literal([void 0,
         void 0, ...])` with only the interpolations left.

         Nothing looks wrong on a first page load, because the CSS is
         inlined into each exported HTML file by _document's
         ServerStyleSheet and hydration keeps the server's class names.
         It breaks on the first client-side route change, where the
         components actually re-render: styled-components hashes the
         empty template into a class nobody has CSS for, injects nothing,
         and the page loses every component style it had. /my bouncing an
         unauthenticated visitor to /login/ was the loudest case, but any
         <Link> did it.

         The comment this replaces said the option had to stay off
         because it rewrites templates from raw text and doubles
         backslash escapes (`content: ' \2022 '`), breaking hydration.
         That does not reproduce on this Next/SWC version: with the
         escape present, server and client agree on the class name. The
         escaped declaration is dropped from the stylesheet either way,
         with this option on or off and with minify on or off, so it is a
         limitation of writing CSS escapes in a JS template literal
         rather than anything this flag controls. Write the character
         itself instead, the way Hero.styles.js writes ' · '. */
      transpileTemplateLiterals: true,
    },
  },
  generateBuildId() {
    const proposedBuildId = getBuildId();
    nextLog.info(
      `Using build ID: ${
        proposedBuildId === null ? 'auto-generated' : `'${proposedBuildId}'`
      }`,
    );
    return proposedBuildId;
  },
  webpack(config, { dev, isServer }) {
    /* The client build only: its files are the ones the HTML names by
       hash. Dev serves nothing that gets deployed. */
    if (!dev && !isServer) config.entry = sortedEntries(config.entry);
    config.plugins.push(
      new EnvironmentPlugin({
        BASE_URL: '',
        REGISTRATION_START: '',
        EVENT_END_DATE: '',
      }),
    );
    config.module.rules.push({
      test: /\.(eot|woff2?|zip|pdf)/,
      type: 'asset/resource',
    });
    return config;
  },
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 120,
  experimental: {
    largePageDataBytes: 128 * 10000, // Setting new threshold (1.28 MB)
  },
};
