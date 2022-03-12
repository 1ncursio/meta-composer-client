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

  const isOwnMessage = useMemo(() => userData?.id === message.user.id, [userData, message.user.id]);

  if (!userData) return null;

  return (
    <div className={styles.messageRow(isOwnMessage)}>
      <div className={styles.messageRowContent(isOwnMessage)}>{message.message}</div>
      <div className="text-base-content select-none">{dayjs(message.createdAt).format('A HH:mm')}</div>
    </div>
  );
};

export default Message;
