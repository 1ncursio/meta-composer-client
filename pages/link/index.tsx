import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import RoomEntryContainer from '../../react-components/RoomEntryContainer';

export interface LinkPageProps {
  isOculus: boolean;
}

const LinkPage: NextPage<LinkPageProps> = ({ isOculus }) => {
  const { t } = useTranslation('common');

  return <RoomEntryContainer isOculus={isOculus} />;
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

export default LinkPage;
