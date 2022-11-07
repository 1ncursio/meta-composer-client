const { i18n } = require('./next-i18next.config');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'lh3.googleusercontent.com', 'localhost', 'images.unsplash.com'],
  },
  i18n: {
    locales: ['en', 'ko', 'ja'],
    defaultLocale: 'ko',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
