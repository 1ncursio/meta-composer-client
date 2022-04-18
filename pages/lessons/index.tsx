import fetcher from '@lib/api/fetcher';
import LessonComponent from '@react-components/lessonComponents';
import ILesson from '@typings/ILesson';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import useSWRInfinite from 'swr/infinite';
const LessonsIndexPage = () => {
  // const { data: LessonData } = useSWR<ILesson[]>('/lessons', fetcher);
  const {
    data: LessonDataList,
    mutate: mutateLessonData,
    setSize,
  } = useSWRInfinite<ILesson[]>((index) => `/lessons?perPage=8&page=${index + 1}`, fetcher);
  const [isListHover, setIsListHover] = useState<number>(-1);

  const [current, setCurrent] = useState<number>(1);
  useCallback(() => {
    console.log(LessonDataList);
  }, [LessonDataList]);
  const onPage = useCallback(
    (page: number, current) => () => {
      if (current + page == 0) return;
      if (page > 0 && LessonDataList && LessonDataList[current - 1]?.length < 7) {
        return;
      }
      setSize((prevSize) => {
        const current = prevSize + page;
        setCurrent(current);
        return current;
      });
    },
    [setSize, LessonDataList],
  );

  return (
    <div className="relative h-full ">
      <div className=" grid grid-cols-4 grid-rows-2 grid-flow-col h-full   m-10   ">
        {LessonDataList &&
          LessonDataList[current - 1]?.map((lesson) => {
            return (
              <div
                key={lesson.id}
                onMouseEnter={() => setIsListHover(lesson.id)}
                onMouseLeave={() => setIsListHover(-1)}
              >
                <LessonComponent lesson={lesson} show={lesson.id === isListHover} />
              </div>
            );
          })}
      </div>
      <div className=" absolute bottom-30 w-full left-1/2">
        <div className="btn-group ">
          <button className="btn" onClick={onPage(-1, current)}>
            «
          </button>
          <button className="btn">{current}</button>
          <button className="btn" onClick={onPage(1, current)}>
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonsIndexPage;
