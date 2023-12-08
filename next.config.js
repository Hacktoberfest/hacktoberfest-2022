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
        API_BASE_URL: '',
        API_EVENT_ID: '',
        REGISTRATION_START: '',
        REGISTRATION_END: '',
        TRACKING_START: '',
        PROFILE_END: '',
      }),
    );
    config.module.rules.push({
      test: /\.(eot|woff2?|zip)/,
      type: 'asset/resource',
    });
    return config;
  },
  rewrites() {
    return [
      {
        source: '/profile/edit',
        destination: '/profile',
      },
    ];
  },
  exportPathMap(defaultPathMap) {
    return {
      ...defaultPathMap,
      '/profile/edit': { page: '/profile' },
    };
  },
  reactStrictMode: true,
  trailingSlash: true,
};
