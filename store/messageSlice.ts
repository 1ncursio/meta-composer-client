import client from '@lib/api/client';
import { IMessage } from '@typings/IMessage';
import produce from 'immer';
import { Socket } from 'socket.io-client';
import { KeyedMutator } from 'swr';
import { AppSlice } from './useStore';

export interface MessageSlice {
  message: {
    sendMessage: ({
      message,
      mutate,
      socket,
      roomId,
    }: {
      message: string;
      mutate: KeyedMutator<IMessage[][]>;
      socket: Socket;
      roomId: number;
    }) => Promise<void>;
  };
}

const createMessageSlice: AppSlice<MessageSlice> = (set, get) => ({
  message: {
    sendMessage: async ({ message, mutate, socket, roomId }) => {
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

        // const { data } = await client.post('/chats', {
        //   message,
        // });
        socket.emit('sendMessage', { roomId, message });
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default createMessageSlice;
