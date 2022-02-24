import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Header from '../react-components/Header';
// @ts-ignore
import { themeChange } from 'theme-change';
import { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';

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
      <Header />
      <main className="container mx-auto">
        <Component {...pageProps} />
      </main>
    </SWRConfig>
  );
}

export default appWithTranslation(MyApp);
