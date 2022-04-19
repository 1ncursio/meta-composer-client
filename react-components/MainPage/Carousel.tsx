import useSWRInfinite from 'swr/infinite';
import CarouselItem from './CarouselItem';
import { useCallback, useState } from 'react';
import fetcher from '@lib/api/fetcher';
import ILesson from '@typings/ILesson';

const Carousel = () => {
  const perPage = 1;

  const {
    data: LessonDataList,
    mutate: mutateLessonData,
    setSize,
  } = useSWRInfinite<ILesson[]>((index) => `/lessons?perPage=${perPage}&page=${1}`, fetcher);

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
    <div className="w-full">
      <div className="carousel-item relative w-full">
        {LessonDataList &&
          LessonDataList[current - 1]?.map((lesson) => {
            return (
              <div key={lesson.id}>
                <CarouselItem lesson={lesson} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Carousel;
