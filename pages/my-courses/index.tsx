import DashboardContainer from '@react-components/DashboardContainer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const MyCoursesPage = () => {
  return <DashboardContainer>MyCoursesPage</DashboardContainer>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default MyCoursesPage;
