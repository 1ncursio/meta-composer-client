import useStore from '@store/useStore';
import { getSocketUrl } from '@utils/getEnv';
import { useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const sockets: { [key: string]: Socket } = {};

const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const { accessToken, getAccessToken } = useStore((state) => state.user);
  console.log('rerender', workspace);

  const disconnect = useCallback(() => {
    console.log('heelow2');
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace] && accessToken) {
    sockets[workspace] = io(`${getSocketUrl()}/${workspace}`, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
