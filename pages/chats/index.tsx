import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import Message from '@react-components/Message';
import { IMessage } from '@typings/IMessage';
import makeSection from '@utils/makeSection';
import produce from 'immer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { MdSend } from 'react-icons/md';
import useSWR from 'swr';

export interface IChatForm {
  message: string;
}

const ChatsIndexPage = () => {
  const { register, handleSubmit, resetField } = useForm<IChatForm>();
  const { data: messagesData, mutate: mutateMessage } = useSWR<IMessage[]>('/chats', fetcher);
  const { data: userData } = useUserSWR();

  const onSendChatMessage = useCallback(
    ({ message }: IChatForm) => {
      if (!userData) return;

      mutateMessage(
        produce((draft) => {
          draft.unshift({
            message,
            user: userData,
          });
        }),
        false,
      );
      resetField('message');
    },
    [resetField, userData, mutateMessage],
  );

  const chatSections = makeSection(messagesData ? [...messagesData].reverse() : []);

  return (
    <div className="flex gap-8 h-full">
      <div>
        <div className="text-base-content font-light">강사와의 채팅</div>
        <div className="text-base-content font-light">학생과의 채팅</div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-scroll">
          {Object.entries(chatSections).map(([date, messages]) => (
            <div key={date}>
              <div className="text-base-content font-light">{date}</div>
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSendChatMessage)} className="flex items-center gap-2 py-4">
          <input
            type="text"
            {...register('message')}
            className="flex-1 input input-bordered input-md focus:outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" className="text-primary w-8 h-8 inline-flex justify-center items-center">
            <MdSend size={24} />
          </button>
        </form>
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
