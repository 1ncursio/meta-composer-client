import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect } from 'react';

export interface ChannelPageProps {
  userAgent: string;
}

const ChannelPage: NextPage<ChannelPageProps> = ({ userAgent }) => {
  useEffect(() => {
    if (userAgent) {
      console.log({ userAgent });
    }
  }, []);

  //   detect if it's a oculus browser
  if (userAgent.indexOf('OculusBrowser') > -1) {
    return <div>오큘러스 브라우저로 접속하셨습니다.</div>;
  }

  return <div>오큘러스 브라우저가 아닙니다.</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const userAgent = req.headers['user-agent'];
  return { props: { userAgent } };
};

export default ChannelPage;
