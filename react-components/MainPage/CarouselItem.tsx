import ILesson from '@typings/ILesson';

import optimizeImage from '@utils/optimizeImage';
import { randomInt } from 'crypto';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

export interface LessonProps {
  lesson: ILesson;
}

const CarouselItem: FC<LessonProps> = ({ lesson }) => {
  const perPage = 1;
  return (
    <div className="hero-content flex-col lg:flex-row">
      {/* <a href="#"> */}
      <img src={optimizeImage(lesson?.imageURL ?? '')} className="max-w-sm rounded-lg shadow-2xl pr-4" />
      {/* <img src={lesson.imageURL} className="rounded-t-lg  w-2/5" /> */}
      {/* </a> */}
      <div>
        <h1 className="text-5xl font-bold">{lesson.name}</h1>
        <p className="py-6">{lesson.__teacher__.user.username}</p>
        <p className="py-6">₩{lesson.price}</p>
      </div>
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide4" className="btn btn-circle opacity-50">
          ❮
        </a>
        <a href="#slide2" className="btn btn-circle opacity-50">
          ❯
        </a>
      </div>
    </div>
  );
};

export default CarouselItem;
