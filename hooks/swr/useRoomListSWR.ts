import fetcher from '@lib/api/fetcher';
import useStore from '@store/useStore';
import IChatRoom from '@typings/IChatRoom';
import useSWR, { SWRConfiguration } from 'swr';

export interface IRoomList {
  /* 강사일때 학생들의 채팅 */
  lessonChat: IChatRoom[];
  /* 학생일때 레슨의 채팅 */
  userChatList: IChatRoom[];
}

export default function useRoomListSWR(options: SWRConfiguration = {}) {
  const { setUserData } = useStore((state) => state.user);
  const response = useSWR<IRoomList>('/chat/roomList', fetcher, { ...options });

  return {
    ...response,
    lessonChatsData: response.data?.lessonChat,
    userChatsData: response.data?.userChatList,
  };
}
