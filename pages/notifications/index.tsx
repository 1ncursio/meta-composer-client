import fetcher from '@lib/api/fetcher';
import DashboardContainer from '@react-components/DashboardContainer';
import Notificaiton from '@react-components/notification';
import NotificaitonButton from '@react-components/notification/button';
import NotificaitonModal from '@react-components/notification/notifitionModal';
import { INotification } from '@typings/INotification';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import client from '@lib/api/client';
import { AiFillDelete } from 'react-icons/ai';
import produce from 'immer';

export interface NotificaitonSWR {
  notifitionData: INotification[];
  notifitionCount: number;
}
const NotificationsIndexPage = () => {
  const {
    data: notifitionlist,
    mutate: mutateNotification,
    setSize,
  } = useSWRInfinite<NotificaitonSWR>((index) => `/notification/list?perPage=5&page=${index + 1}`, fetcher);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifitionInfo, setNotifitionInfo] = useState<INotification | null>();

  const test = (id: number) => async () => {
    const data = await client.get(`/notification/${id}/info`);
    const noti: INotification = data.data.payload;

    setNotifitionInfo(noti);
    mutateNotification();
  };
  const movePage = (notification: INotification) => async () => {
    await client.get(`/notification/${notification.id}/info`);
    window.location.href = window.location.origin + notification.url;
  };
  const clear = () => {
    setNotifitionInfo(null);
  };
  const remove = (id: number) => async () => {
    const data = await client.delete(`/notification/${id}/remove`);
    if (notifitionlist && notifitionlist[currentPage].notifitionData.length === 1) {
      setCurrentPage((before) => before - 1);
    }
    await mutateNotification();
    //이부분 다시 한번더 생각
    // produce(({ notifitionData, notifitionCount }) => {
    //   console.log(notifitionData);
    // }),
  };
  const myH = useMemo(() => {
    if (notifitionlist) {
      return notifitionlist[currentPage]?.notifitionData.length;
    }
  }, [notifitionlist]);

  return (
    <DashboardContainer>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box ">
          {notifitionInfo ? (
            <>
              <h3 className="font-bold text-lg">{notifitionInfo.id}</h3>
              <p className="py-4">{notifitionInfo.created_at}</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <button className="btn btn-square loading "></button>
            </div>
          )}
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn" onClick={clear}>
              Yay!
            </label>
          </div>
        </div>
      </div>
      {/* <div className="max-w-2xl mx-auto mt-10 h-scrin"> */}
      <div className="relative w-full max-w-2xl mx-auto  ">
        <div className="flex flex-col gap-2 m-10 w-full h-4/5">
          {notifitionlist &&
            notifitionlist[currentPage]?.notifitionData.map((noti) => (
              <div key={noti.id} className="flex flex-row h-full max-h-20">
                <div onClick={movePage(noti)} className="w-3/4">
                  <Notificaiton key={noti.id} notification={noti} />
                </div>
                <div className="flex items-center">
                  <AiFillDelete size={30} className="m-auto w-10" onClick={remove(noti.id)} />
                </div>
              </div>
            ))}
        </div>
        <div className={notifitionlist && 'h-' + (20 + 5 * (myH! % 5))}></div>

        <div className="absolute inset-x-0 bottom-0 h-16 flex items-center">
          {notifitionlist && notifitionlist[0].notifitionCount > 5 && (
            <NotificaitonButton
              count={notifitionlist && notifitionlist[0]?.notifitionCount}
              setSize={setSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
      {/* </div> */}
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default NotificationsIndexPage;
