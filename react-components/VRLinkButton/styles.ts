import { classnames } from 'tailwindcss-classnames';
import { VRLinkButtonProps } from '.';

export const linkButton = (state: VRLinkButtonProps['state']) =>
  // @ts-ignore
  classnames('btn', 'btn-primary', 'gap-2', {
    loading: state === 'connecting',
    'btn-error': state === 'disconnected',
  });
