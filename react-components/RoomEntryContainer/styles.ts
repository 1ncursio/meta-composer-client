import { classnames } from 'tailwindcss-classnames';

export const icon = (isOculus: boolean) =>
  // @ts-ignore
  classnames({
    'text-base-300': isOculus,
  });
