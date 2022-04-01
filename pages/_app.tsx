import Header from '@react-components/Header';
import { NextComponentType, NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import { SWRDevTools } from 'swr-devtools';
// @ts-ignore
import { themeChange } from 'theme-change';
import '../styles/globals.css';
import useSocket from '@hooks/useSocket';
import usePushNotification from '@hooks/useNotification';
import ICurrentTarget from '@typings/IEvent';
import { IMessage } from '@typings/IMessage';
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}
import ReactModal from 'react-modal';
export type NextPageWithLayout = NextPage & { getLayout: (page: ReactElement) => ReactElement };

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const [socket] = useSocket('notification');
  const [state, setState] = useState('');

  // ReactModal.setAppElement('#root');

  useEffect(() => {
    setState(window.location.pathname);
  });
  useEffect(() => {
    //여기서 이벤트 재등록 해줘야함
    if (!state.includes('chats')) {
      const ws = window;
      socket?.on('push-message', (msg: IMessage) => {
        const option = {
          requireInteraction: false,
          data: msg,
          body: msg.message,
          icon: '',
          // icon: 'http://localhost:4000/4f85d37c-2835-449d-82ce-1a9f4fe4f82d-pngwing.com.png',
        };
        if (msg.image) {
          option.icon = 'http://localhost:4000/' + msg.image;
        }
        const el = new Notification(msg.sender.username, option);
        el.onclick = function (event) {
          if (event.currentTarget !== null) {
            const test: ICurrentTarget = event.currentTarget;
            ws.location.href = `http://localhost:3000/chats/${test.data?.chatRoomId}`;
          }
        };
      });
    }
  }, [socket, state]);

  const defaultLayout = (page: ReactElement) => (
    <>
      <Header />
      <main className="container mx-auto flex-1">
        <Component {...pageProps} />
      </main>
    </>
  );

  const getLayout = Component.getLayout ?? defaultLayout;

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return getLayout(
    <SWRConfig
      value={{
        errorRetryCount: 3,
      }}
    >
      <SWRDevTools>
        <Component {...pageProps} />
      </SWRDevTools>
    </SWRConfig>,
  );
};

export default appWithTranslation(MyApp);
