import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';
import useStore from '@store/useStore';
import getEnv from '@utils/getEnv';

const sockets: { [key: string]: Socket } = {};

const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const { getAccessToken } = useStore((state) => state.user);
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
    sockets[workspace] = io(`${getEnv('SOCKET_URL')}/${workspace}`, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: getAccessToken(),
      },
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
