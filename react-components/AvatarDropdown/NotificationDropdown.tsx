import useSocket from '@hooks/useSocket';
import useTabs from '@hooks/useTabs';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import { INoteEvent } from '@lib/midi/NoteEvent';
import { INotification } from '@typings/INotification';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { stringify } from 'querystring';
import React, { useCallback, useEffect, useState } from 'react';
import { AiTwotoneSound } from 'react-icons/ai';
import { RiBookLine, RiSettings3Line } from 'react-icons/ri';
import { json } from 'stream/consumers';
import useSWR from 'swr';
import * as styles from './styles';
export interface NotificaitonSWR {
  notifitionData: INotification[];
  notifitionCount: number;
}

const NotificationDropdown = () => {
  const { t } = useTranslation('common');
  const { tab, selectTab } = useTabs();
  const { data: notificationList, mutate: mutateNotification } = useSWR<NotificaitonSWR>(
    '/notification/list?perPage=5&page=1',
    fetcher,
  );

  const [notifitionInfo, setNotifitionInfo] = useState<INotification | null>();
  const showNotification = (id: number) => async () => {
    const data = await client.get(`/notification/${id}/info`);
    const noti: INotification = data.data.payload;

    setNotifitionInfo(noti);
    mutateNotification();
  };
  const notiType = (noti: INotification): string => {
    if (noti.commentId) {
      //레슨 페이지코멘트 페이지로 이동
    }
    if (noti.signupId) {
      //레슨 페이지 강사 입장으로 이동
    }
    return '/';
  };
  const notiConet = useCallback((notification: INotification) => {
    if (!notification) return;
    if (notification.signup) {
      return (notification.signup.__user__.username + '님이 수강등록 하셨습니다.').slice(0, 20) + '...';
    }
    if (notification.commentId) {
      return (
        `${notification.comment.user.username}님이  ${notification.comment.contents.slice(0, 6)}`.slice(0, 20) + '...'
      );
    }
  }, []);

  return (
    <div tabIndex={0} className="shadow card card-compact dropdown-content bg-base-100 w-80 rounded-none">
      <div className="card-body">
        <h3 className="card-title">알림</h3>
      </div>
      {/* <div>{notificationList && JSON.stringify(notificationList.notifitionData)}</div> */}
      <ul className="menu">
        {notificationList &&
          notificationList.notifitionData.map((noti) => (
            <li key={noti.id} className="flex flex-row items-center">
              <Link href={notiType(noti)}>
                <a className="flex-1">
                  <AiTwotoneSound size={24} />
                  {notiConet(noti)}
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
