import React from 'react';
import CreateLessons from '@react-components/Lessons/createLessons';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CreateLessonPage = () => {
  return <CreateLessons />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default CreateLessonPage;
