import { NextPageWithLayout } from '@pages/_app';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const XRSceneContainer = dynamic(import('@react-components/XRSceneContainer'), { ssr: false });

const VRPage: NextPageWithLayout = () => {
  return <XRSceneContainer />;
};

VRPage.getLayout = (page: ReactElement) => page;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default VRPage;
