import useStore from '@store/useStore';
import { getSocketUrl } from '@utils/getEnv';
import { useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const sockets: { [key: string]: Socket } = {};

const useSocket = (workspace?: string, query?: Record<string, any>): [Socket | undefined, () => void] => {
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

  if (!sockets[workspace] && accessToken) {
    console.log('socket connect함');
    console.log(query);
    sockets[workspace] = io(`${getSocketUrl()}/${workspace}`, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
      query: {
        // ...query,
        // TODO: 버그때문에 임시로 넣어둠
        lessonId: 1,
      },
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
