import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';
import useStore from '../store';

const backUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://jungse.shop';

const sockets: { [key: string]: Socket } = {};

const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const { accessToken } = useStore((state) => state.user);
  console.log('rerender', workspace);

  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/${workspace}`, {
      transports: ['websocket'],
      withCredentials: true,
      extraHeaders: {
        authorization: accessToken ?? '',
      },
      auth: {
        token: accessToken ?? '',
      },
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
