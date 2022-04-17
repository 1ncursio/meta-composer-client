import { classnames } from 'tailwindcss-classnames';

// flex-1 h-12 inline-flex justify-center items-center hover:bg-base-300
export const timeTableButton = (isChecked: boolean) =>
  // @ts-ignore
  classnames('flex-1', 'h-12', 'inline-flex', 'justify-center', 'items-center', 'hover:bg-base-300', {
    'bg-primary': isChecked,
  });
