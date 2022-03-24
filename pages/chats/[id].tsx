import useUserSWR from '@hooks/swr/useUserSWR';
import useSocket from '@hooks/useSocket';
import fetcher from '@lib/api/fetcher';
import MessageList from '@react-components/MessageList';
import MessageRoomList from '@react-components/MessageRoomList';
import useStore from '@store/useStore';
import IChatRoom from '@typings/IChatRoom';
import { IMessage } from '@typings/IMessage';
import makeSection from '@utils/makeSection';
import produce from 'immer';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef } from 'react';
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
  } = useSWRInfinite<IMessage[]>((index) => `/chats?perPage=20&page=${index + 1}`, fetcher);
  const { data: roomListData } = useSWR<IChatRoom[]>('/chat/roomList', fetcher);
  const { data: userData } = useUserSWR();
  const [socket] = useSocket();

  const { sendMessage } = useStore((state) => state.message);

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
        });
      } catch (e) {
        console.error(e);
      } finally {
        resetField('message');
        scrollbarRef.current?.scrollToBottom();
      }
    },
    [resetField, userData, mutateMessage, sendMessage, id, socket],
  );

  const onSendImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append('image', e.currentTarget.files![0]);

    console.log({ image: e.currentTarget.files![0] });
  }, []);

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
    socket?.on('getMessage', (message: IMessage) => {
      mutateMessage(
        produce((messages) => {
          messages?.[0].unshift({
            id: (messages[0][0]?.id || 0) + 1,
            message,
            user,
            createdAt: new Date(),
          });
        }),
        false,
      );
    });
    return () => {
      socket?.off('getMessage');
    };
  }, [socket]);

  return (
    <div className="flex gap-8 h-full">
      {roomListData && <MessageRoomList />}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-scroll">
          <MessageList chatSections={chatSections} ref={scrollbarRef} isReachingEnd={isReachingEnd} setSize={setSize} />
        </div>
        <form onSubmit={handleSubmit(onSendChatMessage)} className="flex items-center gap-2 py-4">
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
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default ChatRoomPage;
