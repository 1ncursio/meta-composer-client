import { useRouter } from 'next/router';
import React from 'react';

const LessonPage = () => {
  const router = useRouter();
  const { lessonId } = router.query;
  return <div>레슨 id :{lessonId} 페이지</div>;
};

export default LessonPage;
