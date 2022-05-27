import Header from '@react-components/Header';
import MainPage from '@react-components/MainPage';
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
import ICurrentTarget from '@typings/IEvent';
import { IMessage } from '@typings/IMessage';
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}
// import ReactModal from 'react-modal';
import { INotification } from '@typings/INotification';
import Script from 'next/script';
import useStore from '@store/useStore';
import { useRouter } from 'next/router';
export type NextPageWithLayout = NextPage & { getLayout: (page: ReactElement) => ReactElement };

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const [socket] = useSocket('notification');
  const [state, setState] = useState('');
  const { sendNoti } = useStore((state) => state.notification);
  const router = useRouter();

  useEffect(() => {
    setState(window.location.pathname);
  }, []);

  useEffect(() => {
    //여기서 이벤트 재등록 해줘야함
    if (!state.includes('chats')) {
      const ws = window;
      socket?.on('push-message', (msg: IMessage) => {
        sendNoti({ msg, ws, router });
      });
    }
  }, [socket, state]);

  const defaultLayout = (page: ReactElement) => (
    <>
      <Header />
      <main className="container mx-auto flex-1">
        <Component {...pageProps} />
      </main>
      <Script src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js" />
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
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
