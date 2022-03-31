import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import IChatRoom from '@typings/IChatRoom';
import Link from 'next/link';
import React, { FC } from 'react';

export interface MessageRoomListProps {
  // roomListData: IChatRoom[];
}

const MessageRoomList: FC<MessageRoomListProps> = () => {
  const { lessonChatsData, userChatsData } = useRoomListSWR();

  return (
    <div className="w-50">
      <div className="text-base-content font-light">강사와의 채팅</div>
      {userChatsData?.map((chat) => (
        <div key={chat.id} className="my-5 w-full">
          <Link href={'/chats/' + chat.id}>
            <div className="flex flex-col bg-white shadow-lg rounded w-full p-5 mx-auto ">
              <div className="odd:bg-gray-50 flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer">
                {/* <img className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/women/24.jpg" alt="Rebecca Burke"/> */}
                <div className="flex flex-col">
                  <div>{chat.__lesson__.name.slice(0, 5) + '..'}</div>
                  <div className="text-gray-400 text-sm font-normal">
                    {chat.__messages__[0]?.image ? '이미지 파일' : chat.__messages__[0]?.message.slice(0, 10) + '..'}
                  </div>
                </div>
                {chat.unReadCount > 0 ? (
                  <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
                    {chat.unReadCount}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </Link>
        </div>

        // <div key={chat.id}>{JSON.stringify(chat)}</div>
      ))}
      <div className="text-base-content font-light">학생과의 채팅</div>

      {lessonChatsData?.map((lesson) => (
        <div key={lesson.id}>
          <div>lessonId: {lesson.id}</div>
          {lesson.chatRooms.map((chat) => (
            <div key={chat.id} className="my-5 w-full">
              <Link href={'/chats/' + chat.id}>
                <div className="flex flex-col bg-white shadow-lg rounded w-full p-5 mx-auto ">
                  <div className="odd:bg-gray-50 flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer">
                    {/* <img className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/women/24.jpg" alt="Rebecca Burke"/> */}
                    <div className="flex flex-col">
                      <div>{chat.user.username}</div>
                      <div className="text-gray-400 text-sm font-normal">
                        {chat.__messages__[0]?.image
                          ? '이미지 파일'
                          : chat.__messages__[0]?.message.slice(0, 10) + '..'}
                      </div>
                    </div>
                    {chat.unReadCount > 0 ? (
                      <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
                        {chat.unReadCount}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageRoomList;
