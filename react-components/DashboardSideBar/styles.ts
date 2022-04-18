import { classnames } from 'tailwindcss-classnames';

export const dashboardLink = (bool: boolean) =>
  classnames(
    // @ts-ignore
    'btn',
    'btn-ghost',
    'btn-block',
    'no-animation',
    'justify-start',
    'text-base-content',
    'font-normal',
    'text-sm',
    'gap-3',
    {
      'text-primary': bool,
    },
  );
