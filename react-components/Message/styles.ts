import {
  alignItems,
  classnames,
  display,
  fontWeight,
  gap,
  maxWidth,
  padding,
  pointerEvents,
  textColor,
} from 'tailwindcss-classnames';

export const messageRow = (isOwnMessage: boolean) =>
  classnames(
    display('flex'),
    gap('gap-2'),
    padding('px-4'),
    // 'hover:bg-primary',
    pointerEvents('pointer-events-none'),
    alignItems('items-end'),
    // @ts-ignore
    {
      'flex-row-reverse': isOwnMessage,
      'flex-row': !isOwnMessage,
    },
  );

export const messageRowContent = (isOwnMessage: boolean) =>
  classnames(
    textColor('text-white'),
    fontWeight('font-light'),
    maxWidth('max-w-md'),
    padding('pt-2', 'pb-3', 'pl-4', 'pr-3'),
    // @ts-ignore
    {
      'bg-primary': isOwnMessage,
      'bg-neutral': !isOwnMessage,
      'rounded-l-3xl': isOwnMessage,
      'rounded-r-3xl': !isOwnMessage,
      'rounded-tr-3xl': isOwnMessage,
      'rounded-tl-3xl': !isOwnMessage,
      'text-right': isOwnMessage,
      'text-left': !isOwnMessage,
    },
  );
