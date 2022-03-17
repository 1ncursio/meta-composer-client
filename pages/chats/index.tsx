import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import MessageRoomList from '@react-components/MessageRoomList';
import IChatRoom from '@typings/IChatRoom';
import { IMessage } from '@typings/IMessage';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

export interface IChatForm {
  message: string;
}

const ChatsIndexPage = () => {
  const { register, handleSubmit, resetField } = useForm<IChatForm>();
  const {
    data: messagesData,
    mutate: mutateMessage,
    setSize,
  } = useSWRInfinite<IMessage[]>((index) => `/chats?perPage=20&page=${index + 1}`, fetcher);
  // const { data: roomListData } = useSWR<IChatRoom[]>('/chat/roomList', fetcher);
  // const {data}
  const { data: userData } = useUserSWR();

  return (
    <div className="flex gap-8 h-full">
      <MessageRoomList />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-scroll"></div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default ChatsIndexPage;
