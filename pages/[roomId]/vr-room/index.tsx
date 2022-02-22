import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { AiOutlineDesktop } from 'react-icons/ai';
import { BsBadgeVr } from 'react-icons/bs';
import * as styles from './styles';

export interface VRRoomPageProps {
  isOculus: boolean;
}

const VRRoomPage: NextPage<VRRoomPageProps> = ({ isOculus }) => {
  const router = useRouter();
  const { roomId } = router.query;

  if (isMobile) {
    return (
      <>
        <p>모바일에서는 지원하지 않습니다.</p>
        <p>PC 혹은 Oculus Browser로 접속해주세요.</p>
      </>
    );
  }

  if (isOculus) {
    return <div>오큘러스 브라우저로 접속하셨습니다.</div>;
  }

  return (
    <div>
      <div>룸 아이디 {roomId}</div>
      VRRoomPage
      <AiOutlineDesktop size={128} className={styles.icon(isOculus)} />
      <BsBadgeVr size={128} className={styles.icon(!isOculus)} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const userAgent = req.headers['user-agent'];

  if (!userAgent) {
    return { props: { isOculus: false } };
  }

  const isOculus = userAgent.indexOf('OculusBrowser') > -1;

  return { props: { isOculus } };
};

export default VRRoomPage;
