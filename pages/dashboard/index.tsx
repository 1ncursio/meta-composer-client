import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const DashboardPage = () => {
  const { t } = useTranslation('common');

  return <div>{t('dashboard')}</div>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default DashboardPage;
