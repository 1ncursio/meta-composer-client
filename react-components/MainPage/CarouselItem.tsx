import ILesson from '@typings/ILesson';
import { FC } from 'react';

export interface LessonProps {
  lesson: ILesson;
}

const CarouselItem: FC<LessonProps> = ({ lesson }) => {
  const perPage = 1;
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        {/* <a href="#"> */}
        <img src={lesson?.imageURL} className="w-2/5 rounded-lg shadow-2xl p-4" />
        {/* <img src={lesson.imageURL} className="rounded-t-lg  w-2/5" /> */}
        {/* </a> */}
        <div>
          <h1 className="text-5xl font-bold">{lesson.name}</h1>
          <p className="py-6">{lesson.__teacher__.user.username}</p>
          <p className="py-6">₩{lesson.price}</p>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
