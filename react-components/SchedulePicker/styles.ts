import { classnames } from 'tailwindcss-classnames';

// flex-1 h-12 inline-flex justify-center items-center hover:bg-base-300
export const timeTableButton = ({
  isChecked = false,
  readonly,
  isSelect,
}: {
  isChecked: undefined | boolean;
  readonly: boolean;
  isSelect: boolean;
}) =>
  // @ts-ignore
  classnames('flex-1', 'h-12', 'inline-flex', 'justify-center', 'items-center', {
    'bg-primary': isChecked,
    'bg-red-400': isSelect,
    'hover:bg-base-300': !readonly,
  });
