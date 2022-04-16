import React from 'react';
import CreateLessons from '@react-components/Lessons/createLessons';
import { useRouter } from 'next/router';

const CreateLesson = () => {
  const router = useRouter();
  return <CreateLessons />;
};

export default CreateLesson;
