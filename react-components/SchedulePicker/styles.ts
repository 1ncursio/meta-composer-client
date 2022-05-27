import { classnames } from 'tailwindcss-classnames';

// flex-1 h-12 inline-flex justify-center items-center hover:bg-base-300
export const timeTableButton = ({
  isChecked = false,
  readonly,
  isSelect,
  isEmpty,
}: {
  isChecked: undefined | boolean;
  readonly: boolean;
  isSelect: boolean;
  isEmpty: boolean;
}) =>
  // @ts-ignore
  classnames('flex-1', 'h-12', 'inline-flex', 'justify-center', 'items-center', 'border-r', 'border-b', {
    'bg-primary': isChecked,
    'bg-error': isEmpty,
    'bg-info': isSelect,
    'hover:bg-base-300': !readonly,
  });
