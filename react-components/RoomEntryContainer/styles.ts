import { classnames } from 'tailwindcss-classnames';

export const icon = (isOculus: boolean) =>
  // @ts-ignore
  classnames({
    'text-primary': isOculus,
  });

export const linkButton = (isLoading: boolean) =>
  // @ts-ignore
  classnames('btn', 'btn-primary', 'gap-2', {
    loading: isLoading,
  });
