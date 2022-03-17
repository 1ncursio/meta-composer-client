import Header from '@react-components/Header';
import { NextComponentType, NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { ReactElement, useEffect } from 'react';
import { SWRConfig } from 'swr';
import { SWRDevTools } from 'swr-devtools';
// @ts-ignore
import { themeChange } from 'theme-change';
import '../styles/globals.css';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

export type NextPageWithLayout = NextPage & { getLayout: (page: ReactElement) => ReactElement };

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
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
