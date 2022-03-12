import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Header from '@react-components/Header';
// @ts-ignore
import { themeChange } from 'theme-change';
import { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { SWRDevTools } from 'swr-devtools';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
      }}
    >
      <SWRDevTools>
        <Header />
        <main className="container mx-auto flex-1">
          <Component {...pageProps} />
        </main>
      </SWRDevTools>
    </SWRConfig>
  );
}

export default appWithTranslation(MyApp);
