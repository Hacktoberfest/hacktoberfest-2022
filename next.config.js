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
      // Must stay off: SWC only applies this transform to the client bundle,
      // and it rewrites template literals from their raw text, doubling
      // backslash escapes (e.g. CSS `content: ' \2022 '`). The client then
      // hashes different CSS than the server, breaking hydration.
      transpileTemplateLiterals: false,
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
