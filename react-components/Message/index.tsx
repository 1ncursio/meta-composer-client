import useUserSWR from '@hooks/swr/useUserSWR';
import Avatar from '@react-components/Avatar';
import { IMessage } from '@typings/IMessage';
import React, { FC } from 'react';
import * as styles from './styles';

export interface MessageProps {
  message: IMessage;
}

const Message: FC<MessageProps> = ({ message }) => {
  const { data: userData } = useUserSWR();

  if (!userData) return null;

  return (
    <div className={styles.message(userData.id == message.user.id)}>
      <Avatar user={message.user} size="small" />
      <div className="bg-base-100 text-base-content font-light">{message.message}</div>
    </div>
  );
};

export default Message;
