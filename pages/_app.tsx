import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig>
      <Header />
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
