import useUserSWR from '@hooks/swr/useUserSWR';
import { IMessage } from '@typings/IMessage';
import { INotification } from '@typings/INotification';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';

export interface NotificaitonProps {
  notification: INotification;
}

const Notificaiton: FC<NotificaitonProps> = ({ notification }) => {
  const { data: userData } = useUserSWR();

  return (
    <div className="flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden w-full">
      <div className="w-2 bg-gray-800"></div>
      <div className="flex items-center px-2 py-3">
        <img
          className="w-6 h-6 object-cover rounded-full"
          src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        />
        <div className="mx-3">
          <h2 className="text-m font-semibold text-gray-800">{notification.id}</h2>
          <p className="text-gray-600 text-sm">
            {notification.readTime ? notification.readTime : '안읽음'}
            {/* <a href="#" className="text-blue-500">
              Upload Image
            </a> */}
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notificaiton;
