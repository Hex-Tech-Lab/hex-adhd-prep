const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-nextjs#configuration

  // Suppresses source map uploading logs during build
  silent: true,
  org: "hex-org",
  project: "hex-adhd-prep",
});
