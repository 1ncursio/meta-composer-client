import useUserSWR from '@hooks/swr/useUserSWR';
import { IMessage } from '@typings/IMessage';
import { INotification } from '@typings/INotification';
import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

export interface NotificaitonProps {
  notification: INotification;
}

const Notificaiton: FC<NotificaitonProps> = ({ notification }) => {
  const { data: userData } = useUserSWR();
  const [titile, setTitle] = useState<string>();
  const [introduce, setIntroduce] = useState<string>();
  useEffect(() => {
    if (!notification) return;
    if (notification.signup) {
      setTitle('수강등록');
      setIntroduce(notification.signup.__user__.username + '님이 수강등록 하셨습니다.');
      return;
    }
    if (notification.commentId) {
      setTitle('댓글');
      setIntroduce(`${notification.comment.user.username}님이  ${notification.comment.contents}`.slice(0, 30) + '...');
    }
  }, [notification]);

  return (
    <div className="flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden w-full h-full ">
      <div className="w-2 bg-gray-800"></div>
      <div className="flex items-center px-2 py-3">
        <img
          className="w-6 h-6 object-cover rounded-full"
          src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        />
        <div className="mx-3">
          <h2 className="text-m font-semibold text-gray-800">{titile}</h2>
          <div className="flex flex-row ">
            <p>{introduce} </p>
            <p className="text-gray-600 text-sm place-self-end ">{notification.readTime ? '읽음' : '안읽음'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notificaiton;
