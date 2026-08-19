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
  webpack(config) {
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
