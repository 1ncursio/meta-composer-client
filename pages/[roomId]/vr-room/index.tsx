import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import { isMobile } from 'react-device-detect';
import RoomEntryContainer from '../../../react-components/RoomEntryContainer';
import isOculusBrowser from '../../../utils/isOculusBrowser';

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
        <p>{t('do-not-support-mobile-device')}</p>
        <p>{t('please-use-pc-or-oculus-browser')}</p>
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

  const isOculus = isOculusBrowser(userAgent);

  return {
    props: {
      isOculus,
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
    },
  };
};

export default VRRoomPage;
