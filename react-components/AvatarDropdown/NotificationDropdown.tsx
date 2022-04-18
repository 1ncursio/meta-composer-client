import useSocket from '@hooks/useSocket';
import useTabs from '@hooks/useTabs';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import { INoteEvent } from '@lib/midi/NoteEvent';
import { INotification } from '@typings/INotification';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { stringify } from 'querystring';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AiTwotoneSound } from 'react-icons/ai';
import { RiBookLine, RiSettings3Line } from 'react-icons/ri';
import { json } from 'stream/consumers';
import useSWR from 'swr';
import * as styles from './styles';
export interface NotificaitonProps {
  notifitionData: INotification[] | undefined;
}

const NotificationDropdown: FC<NotificaitonProps> = ({ notifitionData }) => {
  const { t } = useTranslation('common');
  const { tab, selectTab } = useTabs();

  // const [notifitionInfo, setNotifitionInfo] = useState<INotification | null>();
  // const showNotification = (id: number) => async () => {
  //   const data = await client.get(`/notification/${id}/info`);
  //   const noti: INotification = data.data.payload;

  //   setNotifitionInfo(noti);
  //   mutateNotification();
  // };

  return (
    <div tabIndex={0} className="shadow card card-compact  dropdown-content bg-base-100 w-80 rounded-none">
      <div className="card-body hover:bg-gray-200">
        <Link href="/notifications">
          <button className="card-title">알림함</button>
        </Link>
      </div>
      {/* <div>{notificationList && JSON.stringify(notificationList.notifitionData)}</div> */}
      <ul className="menu">
        {notifitionData &&
          notifitionData.map((noti) => (
            <li key={noti.id} className="flex flex-row items-center">
              <Link href={noti.url}>
                <p className="flex-1">
                  <AiTwotoneSound size={24} />
                  {noti.content}
                  {!noti.readTime && (
                    <div className="rounded-full w-5 h-5 bg-red-500 inline-flex justify-center text-center text-sm font-light text-white">
                      N
                    </div>
                  )}
                </p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
