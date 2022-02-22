import { classnames } from 'tailwindcss-classnames';

export const icon = (isOculus) =>
  classnames({
    'text-base-300': isOculus,
  });
