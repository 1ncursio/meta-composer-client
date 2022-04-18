import { classnames } from 'tailwindcss-classnames';

// flex-1 h-12 inline-flex justify-center items-center hover:bg-base-300
export const timeTableButton = ({ isChecked, readonly }: { isChecked: boolean; readonly: boolean }) =>
  // @ts-ignore
  classnames('flex-1', 'h-12', 'inline-flex', 'justify-center', 'items-center', {
    'bg-primary': isChecked,
    'hover:bg-base-300': !readonly,
  });
