import useUserSWR from '@hooks/swr/useUserSWR';
import IChatRoom from '@typings/IChatRoom';
import { IMessage } from '@typings/IMessage';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';

export interface ChatRoomProps {
  chatRoom: IChatRoom;
}

const IRoom: FC<ChatRoomProps> = ({ chatRoom }) => {
  return (
    <div className="flex flex-col bg-white shadow-lg rounded w-full p-5 mx-auto ">
      <div className="odd:bg-gray-50 flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer">
        {/* <img className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/women/24.jpg" alt="Rebecca Burke"/> */}
        <div className="flex flex-col">
          <div>{chatRoom.__lesson__?.name.slice(0, 5) + '..'}</div>
          <div className="text-gray-400 text-sm font-normal">
            {chatRoom.__messages__[0]?.image ? '이미지 파일' : chatRoom.__messages__[0]?.message.slice(0, 10) + '..'}
          </div>
        </div>
        {chatRoom.unReadCount > 0 ? (
          <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
            {chatRoom.unReadCount}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default IRoom;
