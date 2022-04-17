import useUserSWR from '@hooks/swr/useUserSWR';
import { IMessage } from '@typings/IMessage';
import { INotification } from '@typings/INotification';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';
// import ReactModal from 'react-modal';
export interface NotificaitonModalProps {
  isOpen: boolean;
}

const NotificaitonModal: FC<NotificaitonModalProps> = ({ isOpen }) => {
  const { data: userData } = useUserSWR();

  return (
    // <ReactModal isOpen={isOpen}>
    //      </ReactModal>
    <div>
      <h1>ahekf</h1>
    </div>
  );
};

export default NotificaitonModal;
