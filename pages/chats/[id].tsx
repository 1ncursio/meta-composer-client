import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useSocket from '@hooks/useSocket';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import ChatContainer from '@react-components/ChattingContainer';
import MessageList from '@react-components/MessageList';
import MessageRoomList from '@react-components/MessageRoomList';
import useStore from '@store/useStore';
import IChatRoom from '@typings/IChatRoom';
import { IMessage } from '@typings/IMessage';
import { IUserChatList } from '@typings/IRoomList';
import ITeacherChatRoom from '@typings/ITeacherChatRoom';
import IUserChatRoom from '@typings/IUserChatRoom';
import makeSection from '@utils/makeSection';
import produce from 'immer';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useForm } from 'react-hook-form';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { MdSend } from 'react-icons/md';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

export interface IChatForm {
  message: string;
}

const ChatRoomPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const scrollbarRef = useRef<Scrollbars>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, resetField } = useForm<IChatForm>();
  const {
    data: messagesData,
    mutate: mutateMessage,
    setSize,
  } = useSWRInfinite<IMessage[]>((index) => `/chat/${id}/messages?perPage=20&page=${index + 1}`, fetcher);
  const { lessonChatsData, userChatsData, mutate: mutateRoomList } = useRoomListSWR();
  const { data: userData } = useUserSWR();
  const [socket, disconnect] = useSocket('chat');
  const [getSocket] = useSocket('notification');

  const { sendMessage } = useStore((state) => state.message);
  const [userJoin, setUserJoin] = useState(false);
  const [isReadCheck, setIsReadCheck] = useState(false);
  const isEmpty = messagesData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (messagesData && messagesData[messagesData.length - 1]?.length < 20) || false;

  const onSendChatMessage = useCallback(
    async ({ message }: IChatForm) => {
      if (!userData || !message?.trim() || typeof id !== 'string' || !socket) return;
      try {
        sendMessage({
          message,
          mutate: mutateMessage,
          roomId: parseInt(id),
          socket,
          userJoin,
        });
      } catch (e) {
        console.error(e);
      } finally {
        resetField('message');
        scrollbarRef.current?.scrollToBottom();
      }
    },
    [resetField, userData, mutateMessage, sendMessage, id, socket, userJoin],
  );

  const onSendImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof id !== 'string') return;
      const formData = new FormData();
      formData.append('image', e.currentTarget.files![0]);

      const { data } = await client.post(`/chat/${id}`, formData);
      const message: IMessage = data.payload;
      mutateMessage(
        produce((messages) => {
          messages?.[0].unshift(message);
        }),
        false,
      );
    },
    [id],
  );

  const onClickPaperClip = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const chatSections = makeSection(messagesData ? [...messagesData].flat().reverse() : []);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (messagesData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [messagesData]);
  useEffect(() => {
    //이부분 다시 하기 이상함
    if (typeof id === 'string' && userChatsData) {
      mutateRoomList(
        produce(({ lessonChat, userChatList }) => {
          userChatList = userChatList?.map((chatRoom: IUserChatRoom) => {
            if (chatRoom.id === parseInt(id)) {
              chatRoom.unReadCount = 0;
              return;
            }
          });
          lessonChat = lessonChat?.map((lessonChatRoom: ITeacherChatRoom) => {
            lessonChatRoom.chatRooms?.map((chatRoom: IChatRoom) => {
              if (chatRoom.id === parseInt(id)) {
                chatRoom.unReadCount = 0;
                return;
              }
            });
          });
        }),
        false,
      );
      setIsReadCheck(true);
    }
  }, [id, userChatsData]);

  useEffect(() => {
    if (getSocket && typeof id === 'string') {
      setTimeout(() => {
        getSocket.emit('chatJoin-emit', {
          roomId: parseInt(id),
        });
      }, 1000);
    }
    return () => {
      getSocket?.emit('chatLeave-emit');
    };
  }, [getSocket, id]);

  useEffect(() => {
    if (typeof id !== 'string' || !getSocket) return;

    getSocket
      ?.on('push-message', (message: IMessage) => {
        if (message.chatRoomId == parseInt(id)) {
          mutateMessage(
            produce((messages) => {
              messages?.[0].unshift(message);
            }),
            false,
          );
        } else {
          mutateRoomList(
            produce(({ lessonChat, userChatList }) => {
              userChatList = userChatList.map((chatRoom: IUserChatRoom) => {
                if (message.chatRoomId === chatRoom.id) {
                  chatRoom.__messages__ = [message];
                  chatRoom.unReadCount = chatRoom.unReadCount + 1;
                }
                return;
              });
              lessonChat = lessonChat.map((lessonChatRoom: ITeacherChatRoom) => {
                lessonChatRoom.chatRooms?.map((chatRoom: IChatRoom) => {
                  if (message.chatRoomId === chatRoom.id) {
                    chatRoom.__messages__ = [message];
                    chatRoom.unReadCount = chatRoom.unReadCount + 1;
                  }
                  return;
                });
              });
            }),
            false,
          );
        }
      })
      .on('chatJoin-event', () => {
        if (!userJoin) {
          getSocket.emit('chat-current-user-emit');
        }
        setUserJoin(true);
        mutateMessage(
          produce((messages) => {
            messages?.[0].forEach((msg: IMessage) => {
              msg.is_read = true;
            });
          }),
        );
      })
      .on('chatLeave-event', () => {
        setUserJoin(false);
      });
    return () => {
      getSocket?.off('push-message');
      getSocket?.off('chatJoin-event');
      getSocket?.off('chatLeave-event');
    };
  }, [getSocket, id, userJoin, userChatsData]);

  const title = useMemo(() => {
    if (typeof id !== 'string') return;
    let title = 'untitile';
    userChatsData?.forEach((chat) => {
      console.log(chat.id);
      if (chat.id === parseInt(id)) {
        title = chat.__lesson__.name;
      }
    });
    lessonChatsData?.forEach((lesson) => {
      lesson.chatRooms?.forEach((chat) => {
        if (chat.id === parseInt(id)) {
          title = lesson.name;
        }
      });
    });

    return title;
  }, [id, lessonChatsData, userChatsData]);

  return (
    <ChatContainer>
      {' '}
      {typeof id === 'string' && <MessageRoomList currentRoomId={parseInt(id)} />}
      <div className="flex-1 flex flex-col h-4/5 bg-gray-100 rounded border border-gray-150">
        <div className=" text-xl p-2 font-bold w-full border-b text-center ">{title}</div>
        <div className="flex-1 overflow-y-scroll">
          <MessageList chatSections={chatSections} ref={scrollbarRef} isReachingEnd={isReachingEnd} setSize={setSize} />
        </div>
        <form onSubmit={handleSubmit(onSendChatMessage)} className="flex items-center gap-2 py-4 bg-gray-200 rounded">
          <div className="flex-1 relative">
            <input
              type="text"
              {...register('message')}
              className="input input-bordered input-md focus:outline-none w-full"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <input hidden type="file" ref={imageInputRef} accept=".gif, .jpeg, .jpg, .png" onChange={onSendImage} />
            <AiOutlinePaperClip
              className="absolute top-1/2 right-0 text-base-content transform -translate-y-1/2 -translate-x-1/2"
              size={24}
              onClick={onClickPaperClip}
            />
          </div>
          <button type="submit" className="text-primary w-8 h-8 inline-flex justify-center items-center">
            <MdSend size={24} />
          </button>
        </form>
      </div>
    </ChatContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default ChatRoomPage;
