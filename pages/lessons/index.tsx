import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import LessonComponent from '@react-components/lessonComponents';
import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import useSWRInfinite from 'swr/infinite';
const LessonsIndexPage = () => {
  const router = useRouter();
  const { searchKeyword, searchWord } = router.query;

  const [wordSearch, setWordSearch] = useState<string>();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('!!');
    setWordSearch(e.target.value);
  };
  const onSearchSubmit = useCallback(() => {
    router.push(`/lessons?searchWord=${wordSearch}`);
  }, [wordSearch]);

  const { data: userData } = useUserSWR();
  const {
    data: LessonDataList,
    mutate: mutateLessonData,
    setSize,
  } = useSWRInfinite<ILesson[]>(
    (index) =>
      searchKeyword
        ? `/lessons/type?searchKeyword=${searchKeyword}&perPage=8&page=${index + 1}`
        : searchWord
        ? `/lessons/search?searchKeyword=${searchWord}&perPage=8&page=${index + 1}`
        : `/lessons?perPage=8&page=${index + 1}`,
    fetcher,
  );
  const [isListHover, setIsListHover] = useState<number>(-1);

  const [current, setCurrent] = useState<number>(1);

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
    <div className="relative ">
      <div className="flex flex-col items-end mt-4">
        {userData?.teacher && (
          <Link href="/lessons/createLesson">
            <a className="bg-primary p-1 rounded font-bold text-sm hover:bg-gray-500">레슨생성</a>
          </Link>
        )}
      </div>
      <div className="flex h-screen p-4">
        <div className="container    w-52 ">
          <div className=" flex flex-col items-center border bg-gray-100">
            <div className="p-2 text-md text-center font-normal border-b-2  w-full">
              <Link href={`/lessons`}>
                <a>전체보기 </a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal border-b-2  w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Sonata`}>
                <a>Sonata</a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal border-b-2  w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Etudes`}>
                <a>Etudes</a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal  border-b-2    w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Waltzes`}>
                <a>Waltzes</a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal   w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Marches`}>
                <a>Marches</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full w-4/5 gap-4">
          <div className="w-full  border-b-2 p-2 flex flex-row-reverse	 items-center">
            <button className="bg-yellow-400 h-full p-1 font-bold text-white " onClick={onSearchSubmit}>
              검색
            </button>
            <input type="text" className="border p-2 text-sm h-full" onChange={onSearch} placeholder="레슨 검색하기" />
          </div>
          <div className="container grid grid-cols-4 grid-rows-2 grid-flow-col h-full w-full   ">
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
        </div>
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
