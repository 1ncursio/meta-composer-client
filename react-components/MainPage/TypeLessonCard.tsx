import useSWRInfinite from 'swr/infinite';
import LessonComponent from './LessonComponent';
import { useCallback, useState } from 'react';
import fetcher from '@lib/api/fetcher';
import ILesson from '@typings/ILesson';

const TypeLessonCard = () => {
  const perPage = 4;

  const {
    data: LessonDataList,
    mutate: mutateLessonData,
    setSize,
  } = useSWRInfinite<ILesson[]>((index) => `/lessons/type?searchKeyword=Sonata&perPage=${perPage}&page=${1}`, fetcher);
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
    <div>
      <div className="grid grid-cols-4">
        {LessonDataList &&
          LessonDataList?.[current - 1]?.map((lesson) => {
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
  );
};

export default TypeLessonCard;
