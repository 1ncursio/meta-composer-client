import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import client from '@lib/api/client';
import AvatarDefaultImage from '@react-components/AvatarDefaultImage';
import IChatRoom from '@typings/IChatRoom';
import ITeacherChatRoom from '@typings/ITeacherChatRoom';
import IUserChatRoom from '@typings/IUserChatRoom';
import produce from 'immer';
import Image from 'next/image';
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
    <div className="w-1/4 h-5/6 bg-gray-100 ">
      {userChatsData && userChatsData.length > 0 && (
        <div className="w-full p2 flex flex-col gap-2 mb-2 items-center">
          <div className="text-blue-500 text-xl p-2 font-bold w-full    border-b  ">
            <div className="w-4/5 mx-auto">Chatting</div>
          </div>
          {userChatsData?.map((chat) => (
            <div
              key={chat.id}
              className=" w-5/6"
              onMouseEnter={() => setIsListHover(chat.id)}
              onMouseLeave={() => setIsListHover(-1)}
            >
              <div className="flex flex-row bg-white shadow-lg rounded-lg w-full p-3 mx-auto ">
                <Link href={'/chats/' + chat.id}>
                  <div className="flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer w-full">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <AvatarDefaultImage
                          image={chat.__lesson__.__teacher__.user.profile_image}
                          username={chat.__lesson__.__teacher__.user.username}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-1/2 lg:w-3/5">
                      <p className="truncate">{chat.__lesson__.__teacher__.user.username}</p>
                      {/* <div className="text-gray-400 text-sm font-normal truncate">
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
        <div className=" w-full  flex flex-col gap-2  items-center">
          {/* <div className="text-base-content  font-bold ">학생과의 채팅</div> */}
          {lessonChatsData?.map((lesson) => (
            <div key={lesson.id} className="w-full">
              {/* <div className="bg-gray-100 p-2"> */}
              {/* <div className="text-center">{lesson.name.slice(0, 10)}</div> */}

              {lesson.chatRooms &&
                lesson.chatRooms.map((chat) => (
                  <div
                    key={chat.id}
                    className=" w-full"
                    onMouseEnter={() => setIsListHover(chat.id)}
                    onMouseLeave={() => setIsListHover(-1)}
                  >
                    <div className="flex flex-row bg-white shadow-lg rounded-lg  w-5/6  p-3 mx-auto ">
                      <Link href={'/chats/' + chat.id}>
                        <div className=" flex gap-3 items-center font-semibold text-gray-800 p-3 hover:bg-gray-100 rounded-md hover:cursor-pointer w-full">
                          <div className="avatar">
                            <div className="w-10 rounded-full">
                              <AvatarDefaultImage image={chat.user.profile_image} username={chat.user.username} />
                            </div>
                          </div>

                          <div className="flex flex-col w-1/2 lg:w-3/5">
                            <p className="truncate">{chat.user.username}</p>
                            {/* <div className="text-gray-400 text-sm font-normal truncate">
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
