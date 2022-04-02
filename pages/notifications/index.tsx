import fetcher from '@lib/api/fetcher';
import DashboardContainer from '@react-components/DashboardContainer';
import Notificaiton from '@react-components/notification';
import NotificaitonButton from '@react-components/notification/button';
import NotificaitonModal from '@react-components/notification/notifitionModal';
import { INotification } from '@typings/INotification';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

export interface NotificaitonSWR {
  notifitionData: INotification[];
  notifitionCount: number;
}
const NotificationsIndexPage = () => {
  const {
    data: notifitionlist,
    mutate: mutateMessage,
    setSize,
  } = useSWRInfinite<NotificaitonSWR>((index) => `/notification/list?perPage=5&page=${index + 1}`, fetcher);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const test = () => {
    setIsOpen(true);
    console.log('Dddd');
  };
  return (
    <DashboardContainer>
      <button onClick={test}>ddddd</button>
      {/* <NotificaitonModal isOpen={isOpen} />
       */}
      <Transition appear show={isOpen}></Transition>
      <div className="relative w-96 ">
        <div className="flex flex-col gap-2 m-10 w-full h-4/5">
          {notifitionlist &&
            notifitionlist[currentPage]?.notifitionData.map((noti) => (
              <Notificaiton key={noti.id} notification={noti} />
            ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 flex items-center">
          {notifitionlist && (
            <NotificaitonButton
              count={notifitionlist && notifitionlist[0]?.notifitionCount}
              setSize={setSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default NotificationsIndexPage;
