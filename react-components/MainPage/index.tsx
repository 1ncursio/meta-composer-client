import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import ILesson from '@typings/ILesson';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import CarouselComponent from './CarouselComponent';

import useSWRInfinite from 'swr/infinite';
import CardItem from './CardItem';
import TypeLessonCard from './TypeLessonCard';
import HeroItem from './HeroItem';
import ConcourComponent from './ConcourComponent';

const MainPage = () => {
  const perPage = 4;

  const {
    data: LessonDataList,
    mutate: mutateLessonData,
    setSize,
  } = useSWRInfinite<ILesson[]>((index) => `/lessons/?perPage=${perPage}&page=${1}`, fetcher);
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
      <div className="carousel w-full">
        <CarouselComponent />
      </div>
      <br />
      <br />
      <div className="text-center">
        <h1 className="text-2xl font-bold">레슨기회의 평등을 추구합니다</h1>
        <br />
        <input
          type="text"
          placeholder="배우고 싶은 레슨을 입력해주세요"
          className="input input-bordered item-center line w-full max-w-xs"
        />
      </div>
      <br />
      <br />
      <h1 className="text-2xl font-bold">
        새로 등록된 레슨!&nbsp;
        <div className="badge badge-secondary">
          <a href="/lessons"> NEW &nbsp;&gt;</a>
        </div>
      </h1>
      <h2 className="opacity-50">한 번 도전해보세요!</h2>
      <br />
      <CardItem />
      <br />
      <br />
      <h1 className="text-2xl font-bold">
        Sonata 레슨&nbsp;
        <div className="badge badge-error">
          <a href="/lessons"> GO &nbsp;&gt;</a>
        </div>
      </h1>
      <h2 className="opacity-50 pb-4">당신도 할 수 있다!!</h2>
      <TypeLessonCard />
      <br />
      <br />
      <HeroItem />
      <br />
      <br />
      <h1 className="text-2xl font-bold">
        콩쿠르 참가하러 가기&nbsp;
        <div className="badge badge-error">
          <a href="/concours"> GO &nbsp;&gt;</a>
        </div>
      </h1>
      <div>
        <ConcourComponent />
      </div>
      <br />
      <br />
      <footer className="footer p-10 bg-base-300 text-base-content">
        <div>
          <span className="footer-title">Services</span>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </div>
        <div>
          <span className="footer-title">Social</span>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
