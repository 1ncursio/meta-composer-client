import { classnames } from 'tailwindcss-classnames';

export const stateControlButton = (isOn: boolean) =>
  // @ts-ignore
  classnames('btn', 'btn-circle', 'border-none', 'no-animation', {
    'btn-error': !isOn,
  });
