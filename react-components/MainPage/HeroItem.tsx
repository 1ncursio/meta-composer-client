import ILesson from '@typings/ILesson';
import Router from 'next/router';
import { FC } from 'react';

// export interface LessonProps {
//   lesson: ILesson;
// }

const HeroItem = () => {
  const moveRouter = () => {
    Router.push('/lessons');
  };
  return (
    <div>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="http://thescienceplus.com/news/data/20200123/p1065585887550764_689_thum.jpg"
          className="w-full md:w-auto rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">메타컴포저와 함께해요.</h1>
          <p className="py-6">입문자인 당신도 피아노 고수가 될 수 있습니다.</p>
          <button onClick={moveRouter} className="btn btn-primary">
            레슨 페이지로
          </button>
        </div>
      </div>
    </div>
  );
};
export default HeroItem;
