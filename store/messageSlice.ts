import client from '@lib/api/client';
import { IMessage } from '@typings/IMessage';
import produce from 'immer';
import { KeyedMutator } from 'swr';
import { AppSlice } from './useStore';

export interface MessageSlice {
  message: {
    sendMessage: ({ message, mutate }: { message: string; mutate: KeyedMutator<IMessage[][]> }) => Promise<void>;
  };
}

const createMessageSlice: AppSlice<MessageSlice> = (set, get) => ({
  message: {
    sendMessage: async ({ message, mutate }) => {
      try {
        const user = get().user.userData;
        if (!user) return;

        mutate(
          produce((messages) => {
            messages?.[0].unshift({
              id: (messages[0][0]?.id || 0) + 1,
              message,
              user,
              createdAt: new Date(),
            });
          }),
          false,
        );

        const { data } = await client.post('/chats', {
          message,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default createMessageSlice;
