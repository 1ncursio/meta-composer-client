import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useRef, useState } from 'react';
import IUser from '@typings/IUser';
import AvatarDropdown from './AvatarDropdown/AvatarDropdown';
import AvatarDefaultImage from './AvatarDefaultImage';
import { BsBell } from 'react-icons/bs';
import NotificationDropdown from './AvatarDropdown/NotificationDropdown';
import { INotification } from '@typings/INotification';
import useSocket from '@hooks/useSocket';
import useSWR from 'swr';
import fetcher from '@lib/api/fetcher';
import produce from 'immer';

export interface NotificaitonSWR {
  notifitionData: INotification[];
  notifitionCount: number;
}
export interface NavNoptificationProps {
  user?: IUser;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  hasDropdown?: boolean;
}

const NavNoptification: FC<NavNoptificationProps> = ({ user, onClick, hasDropdown }) => {
  const [socket] = useSocket('notification');
  const [color, setColor] = useState<string>();
  const { data: notificationList, mutate: mutateNotification } = useSWR<NotificaitonSWR>(
    '/notification/list?perPage=5&page=1',
    fetcher,
  );
  useEffect(() => {
    console.log(notificationList?.notifitionCount);
  }, [notificationList]);

  useEffect(() => {
    socket?.on('notification', (msg: INotification) => {
      mutateNotification(
        produce(({ notifitionData, notifitionCount }) => {
          notifitionData = [msg].concat(...notifitionData.slice(1, 5));
          notifitionCount = notifitionCount + 1;
          return { notifitionData, notifitionCount };
        }),
        false,
      );
    });
  }, [socket]);

  if (!user) {
    return <div>loading</div>;
  }

  if (!hasDropdown) {
    return (
      <div>
        <BsBell size={40} />{' '}
        <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
          {notificationList?.notifitionCount}
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover flex flex-row">
      <Link href="/notifications">
        <a>
          <div tabIndex={0} className="avatar">
            {/* <div className="w-10 rounded-full"> */}
            <BsBell size={24} color={color} />
            {/* </div> */}
          </div>
        </a>
      </Link>
      {notificationList && notificationList?.notifitionCount > 0 && (
        <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center items-center text-sm font-light text-white">
          {notificationList?.notifitionCount}
        </div>
      )}
      {hasDropdown && <NotificationDropdown notifitionData={notificationList?.notifitionData} />}
    </div>
  );
};

export default NavNoptification;
