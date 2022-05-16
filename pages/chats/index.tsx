import useRoomListSWR from '@hooks/swr/useRoomListSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import ChatContainer from '@react-components/ChattingContainer';
import DashboardContainer from '@react-components/DashboardContainer';
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
  return (
    <ChatContainer>
      {/* <div className="flex gap-8 h-full"> */}
      <MessageRoomList currentRoomId={null} />
      <div className="w-1/2 h-4/5 bg-gray-100"></div>
      {/* <div></div>
      </MessageRoomList> */}
      {/* <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-scroll"></div>
      </div> */}
      {/* </div> */}
    </ChatContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default ChatsIndexPage;
