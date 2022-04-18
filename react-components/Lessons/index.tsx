import React, { FC, useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import fetcher from '@lib/api/fetcher';
import axios from 'axios';
import LessonItem, { LessonItemProps } from './LessonItem';

export interface Lesson {
  name: string;
  introduce: string;
  length: Date;
  price: number;
  type: string;
  id: number;
  teacherId: 1;
  day: Date;
  time: Date;
}

export interface TimeList {
  time: Date;
}

const LessonsPage = () => {
  const { data: lessonData } = useSWR<Lesson[]>('http://localhost:4000/api/lessons', fetcher);

  useEffect(() => {
    if (lessonData) console.log(lessonData);
  }, [lessonData]);

  const moveRouter = () => {
    Router.push('/lessons/createLesson');
  };

  return (
    <div>
      <h1>Lessons Page</h1>
      <br />
      <div className="pb-4">
        <button className="btn" onClick={moveRouter}>
          등록
        </button>
      </div>
      <hr />
      <ul>
        <h2 className="pt-4 font-bold">등록된 레슨</h2>
      </ul>
      <div className="pt-2 relative mx-auto text-gray-600">
        <input
          className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
          type="search"
          placeholder="Search"
        />
        <button type="submit" className="btn">
          검색
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {lessonData?.map((lesson) => (
          <LessonItem lesson={lesson} key={lesson.id} />
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
