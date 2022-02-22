import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import { isMobile } from 'react-device-detect';
import RoomEntryContainer from '../../../react-components/RoomEntryContainer';

export interface VRRoomPageProps {
  isOculus: boolean;
}

const VRRoomPage: NextPage<VRRoomPageProps> = ({ isOculus }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { roomId } = router.query;

  if (isMobile) {
    return (
      <>
        <p>{t('모바일에서는 지원하지 않습니다.')}</p>
        <p>{t('PC 혹은 Oculus Browser로 접속해주세요.')}</p>
      </>
    );
  }

  return (
    <div>
      <div>{roomId}</div>
      <RoomEntryContainer isOculus={isOculus} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const userAgent = req.headers['user-agent'];

  if (!userAgent) {
    return { props: { isOculus: false, ...(await serverSideTranslations(locale || 'ko', ['common'])) } };
  }

  const isOculus = userAgent.indexOf('OculusBrowser') > -1;

  return {
    props: {
      isOculus,
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
    },
  };
};

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale || 'ko', ['common'])),
//   },
// });

export default VRRoomPage;
