import useUserSWR from '@hooks/swr/useUserSWR';
import { IMessage } from '@typings/IMessage';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';
import * as styles from './styles';

export interface MessageProps {
  message: IMessage;
}

const ImageMessage: FC<MessageProps> = ({ message }) => {
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
      <img className="w-1/4" src={'http://localhost:4000/' + message.image} />
      <div className="text-base-content select-none">{dayjs(message.created_at).format('A HH:mm')}</div>
      <div>{isReadMessage}</div>
    </div>
  );
};

export default ImageMessage;
