import useUserSWR from '@hooks/swr/useUserSWR';
import { IMessage } from '@typings/IMessage';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';
import * as styles from './styles';

export interface MessageProps {
  message: IMessage;
}

const Message: FC<MessageProps> = ({ message }) => {
  const { data: userData } = useUserSWR();

  const isOwnMessage = useMemo(() => userData?.id === message.senderId, [userData, message.senderId]);
  const isReadMessage = useMemo(() => {
    if (isOwnMessage) {
      if (message.is_read) {
        return '읽음';
      } else {
        return '안읽음';
      }
    }
  }, [isOwnMessage, message.is_read]);
  if (!userData) return null;

  return (
    <div className={styles.messageRow(isOwnMessage)}>
      {/* <div className={styles.messageRowContent(isOwnMessage)}>{message.message}</div> */}
      <div
        className={`font-normal max-w-md pt-2 pb-3 pl-4 pr-3 ${
          userData.id === message.senderId ? 'bg-blue-500 text-white' : 'bg-gray-200'
        } rounded-md rounded-tl-2xl text-left`}
      >
        {message.message}
      </div>
      <div className="text-base-content text-gray-400 text-sm select-none">
        {dayjs(message.created_at).format('A HH:mm')}
      </div>
      <div>{isReadMessage}</div>
    </div>
  );
};

export default Message;
