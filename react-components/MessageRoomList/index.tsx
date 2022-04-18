import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import client from '@lib/api/client';
import IChatRoom from '@typings/IChatRoom';
import ITeacherChatRoom from '@typings/ITeacherChatRoom';
import IUserChatRoom from '@typings/IUserChatRoom';
import produce from 'immer';
import Link from 'next/link';
import React, { FC, useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';

export interface MessageRoomListProps {
  currentRoomId: number | null;
}

const MessageRoomList: FC<MessageRoomListProps> = ({ currentRoomId }) => {
  const { lessonChatsData, userChatsData, mutate: mutateRoomList } = useRoomListSWR();
  const [isListHover, setIsListHover] = useState<number>(-1);

  const onclicks = (id: number) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { data } = await client.delete(`chat/${isListHover}/chatRoom/`);
    mutateRoomList();
    // produce(({ lessonChat, userChatList }) => {
    //   userChatList = userChatList.filter((chatRoom: IChatRoom) => {
    //     return chatRoom.id !== id;
    //   });

    //   lessonChat.forEach((lessonChatRoom: ITeacherChatRoom) => {
    //     lessonChatRoom.chatRooms = lessonChatRoom?.chatRooms?.filter((chatRoom: IChatRoom) => {
    //       if (chatRoom.id !== id) return chatRoom;
    //     });
    //   });
    //   // // console.log(lessonChat);
    //   return { userChatList, lessonChat };
    // }),
    // false,
    if (currentRoomId === id) {
      window.location.href = `${window.location.origin}/chats`;
    }

    //여기서 다른 페이지 가는것도 해야됨
  };
  return (
    <div className="w-60">
      {userChatsData && userChatsData.length > 0 && (
        <div className="bg-gray-200 p2 flex flex-col items-center">
          <div className="text-base-content  font-bold ">강사와의 채팅</div>
          {userChatsData?.map((chat) => (
            <div
              key={chat.id}
              className="my-5 w-5/6"
              onMouseEnter={() => setIsListHover(chat.id)}
              onMouseLeave={() => setIsListHover(-1)}
            >
              <div className="flex flex-row bg-white shadow-lg rounded w-full p-5 mx-auto ">
                <Link href={'/chats/' + chat.id}>
                  <div className="odd:bg-gray-50 flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer w-full">
                    {/* <img className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/women/24.jpg" alt="Rebecca Burke"/> */}
                    <div className="flex flex-col">
                      <div>{chat.__lesson__?.name.slice(0, 6) + '..'}</div>
                      {/* <div className="text-gray-400 text-sm font-normal">
                  {chat?.__messages__[0]?.image
                    ? '이미지 파일'
                    : chat.__messages__[0]
                    ? chat.__messages__[0].message.slice(0, 10) + '..'
                    : '채팅을 시작해 보세요!'}
                </div> */}
                    </div>
                    {chat.unReadCount > 0 ? (
                      <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
                        {chat.unReadCount}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </Link>
                <button onClick={onclicks(chat.id)}>
                  {isListHover === chat.id ? <AiFillDelete size={30} className="mx-auto w-10" /> : <div></div>}
                </button>
              </div>
            </div>

            // <div key={chat.id}>{JSON.stringify(chat)}</div>
          ))}
        </div>
      )}

      {lessonChatsData && lessonChatsData?.length > 0 && (
        <div className="mt-2 bg-gray-200 p2 flex flex-col items-center">
          <div className="text-base-content  font-bold ">학생과의 채팅</div>
          {lessonChatsData?.map((lesson) => (
            <div key={lesson.id}>
              {/* <div className="bg-gray-100 p-2"> */}
              <div className="text-center">{lesson.name.slice(0, 10)}</div>

              {lesson.chatRooms &&
                lesson.chatRooms.map((chat) => (
                  <div
                    key={chat.id}
                    className="my-5 w-full"
                    onMouseEnter={() => setIsListHover(chat.id)}
                    onMouseLeave={() => setIsListHover(-1)}
                  >
                    <div className="flex flex-row bg-white shadow-lg rounded w-full p-5 mx-auto ">
                      <Link href={'/chats/' + chat.id}>
                        <div className="odd:bg-gray-50 flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer w-full">
                          {/* <img className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/women/24.jpg" alt="Rebecca Burke"/> */}
                          <div className="flex flex-col">
                            <div>{chat.user.username.slice(0, 10)}</div>
                            {/* <div className="text-gray-400 text-sm font-normal">
                            {chat.__messages__[0]?.image
                              ? '이미지 파일'
                              : chat.__messages__[0]
                              ? chat.__messages__[0].message.slice(0, 10) + '..'
                              : '채팅을 시작해 보세요!'}
                          </div> */}
                          </div>
                          {chat.unReadCount > 0 ? (
                            <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
                              {chat.unReadCount}
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </Link>
                      <button onClick={onclicks(chat.id)}>
                        {isListHover === chat.id ? <AiFillDelete size={30} className="mx-auto w-10" /> : <div></div>}
                      </button>
                    </div>
                  </div>
                ))}
              {/* </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageRoomList;
