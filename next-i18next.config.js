const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'ko', 'ja'],
    defaultLocale: 'ko',
  },
  localePath: path.resolve('./public/locales'),
};
