import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import IChatRoom from '@typings/IChatRoom';
import React, { FC } from 'react';

export interface MessageRoomListProps {
  // roomListData: IChatRoom[];
}

const MessageRoomList: FC<MessageRoomListProps> = () => {
  const { lessonChatsData, userChatsData } = useRoomListSWR();

  return (
    <div>
      <div className="text-base-content font-light">강사와의 채팅</div>
      {userChatsData?.map((chat) => (
        <div key={chat.id}>{JSON.stringify(chat)}</div>
      ))}
      <div className="text-base-content font-light">학생과의 채팅</div>
      {lessonChatsData?.map((chat) => (
        <div key={chat.id}>{JSON.stringify(chat)}</div>
      ))}
    </div>
  );
};

export default MessageRoomList;
