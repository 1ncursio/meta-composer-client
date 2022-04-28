import client from '@lib/api/client';
import { IMessage } from '@typings/IMessage';
import dayjs from 'dayjs';
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
      userJoin,
    }: {
      message: string;
      mutate: KeyedMutator<IMessage[][]>;
      socket: Socket;
      roomId: number;
      userJoin: boolean;
    }) => Promise<void>;
  };
}

const createMessageSlice: AppSlice<MessageSlice> = (set, get) => ({
  message: {
    sendMessage: async ({ message, mutate, socket, roomId, userJoin }) => {
      try {
        const user = get().user.userData;
        if (!user) return;
        mutate(
          produce((messages) => {
            messages?.[0].unshift({
              id: (messages[0][0]?.id || 0) + 1,
              message,
              user,
              created_at: Date.now(),
              senderId: user.id,
              is_read: userJoin,
            });
          }),
          false,
        );

        const { data } = await client.post(`/chat/${roomId}`, {
          message,
          is_read: userJoin,
        });
        // socket.emit('sendMessage', { roomId, message });
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default createMessageSlice;
