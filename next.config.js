/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'ko-KR', 'ja-JP'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'ko-KR',
  },
};

module.exports = nextConfig;
