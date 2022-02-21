import { classnames, flex, fontSize, textColor } from 'tailwindcss-classnames';

export const tab = (selected: boolean) =>
  // @ts-ignore
  classnames('tab', 'tab-bordered', flex('flex-1'), fontSize('text-base'), textColor('text-base-content'), {
    'font-bold': selected,
    'border-primary': selected,
  });
