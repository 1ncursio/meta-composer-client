import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import LessonIntoroduce from '@react-components/lessonComponents/introduce';
import LessonReview from '@react-components/lessonComponents/review';
import ILesson from '@typings/ILesson';
import optimizeImage from '@utils/optimizeImage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import useSWR from 'swr';
const scrollToRef = (ref: any) => window.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' });
const LessonPage = () => {
  const router = useRouter();
  const { lessonId, current } = router.query;
  const { data: lessonData, mutate: mutateLessonData } = useSWR<ILesson>(
    lessonId ? `/lessons/${lessonId}` : null,
    fetcher,
  );
  const [start, setStart] = useState<boolean[]>();

  const Evaluation = useMemo(() => {
    if (!lessonData) return 1;
    const result = lessonData.comments.reduce((sum, com) => {
      return sum + com.rating;
    }, 0);
    const avg = Math.round((result / lessonData.comments.length) * 10) / 10.0;
    return result < 1 ? 0 : avg;
  }, [lessonData]);

  useEffect(() => {
    const a = Math.floor(Math.random() * 5);
    const arr = [];
    for (let i = 0; i < 4; i++) {
      if (i + 1 < Evaluation) {
        arr.push(true);
      } else {
        arr.push(false);
      }
    }

    setStart(arr);
  }, [Evaluation]);

  const moveChatRoom = useCallback(async () => {
    const chatroom = await client.post(`/chat/${lessonId}/chatRoom`);
    window.location.href = window.location.origin + '/chats';
  }, [lessonData]);

  const myRef = useRef(null);
  const executeScroll = () => scrollToRef(myRef);

  return (
    <div className=" w-full h-full">
      <div className="h-72 w-100 bg-gray-700  pt-12 pl-4">
        {/* <img src={lessonData?.imageURL} className="h-3/4 w-1/3"></img> */}
        <div className="flex flex-row">
          <div className="avatar ">
            <div className="ml-28 w-80 h-52 rounded-xl">
              <img src={optimizeImage(lessonData?.imageURL ?? '')} />
            </div>
          </div>
          <div className="flex flex-col ml-8">
            <p className="text-sm font-semibold text-white mb-4">{lessonData?.type}</p>
            <p className="text-2xl font-extrabold text-white mb-10">{lessonData?.name}</p>
            <div className="rating rating-sm mb-4">
              <input type="radio" className="mask mask-star-2 bg-orange-400" />
              {start?.map((start, index) => {
                if (start) {
                  return <div key={index} className="mask mask-star-2 bg-orange-400  w-4" />;
                } else {
                  return <div key={index} className="mask mask-star-2 bg-orange-100  w-4" />;
                }
              })}
            </div>
            <div className="flex flex-row gap-2 mb-5">
              <BsFillPersonFill />
              <p className="text-xs font-semibold text-white">{lessonData?.__teacher__.user.username}</p>
            </div>
            <div className="hidden lg:flex flex-row gap-2">
              <p className="text-white">#</p>
              <div className="badge badge-primary">태그</div>
              <div className="badge badge-primary">태그</div>
              <div className="badge badge-primary">태그</div>
            </div>
          </div>
        </div>
      </div>
      <div className="tabs border-b-2  mt-2   ">
        <Link href={`/lessons/${lessonId}`}>
          <p className="tab ml-16 text-black font-bold">강의 소개</p>
        </Link>
        {/* <Link href={`/lessons/${lessonId}?current=review`}>
          <p className="tab text-black font-bold">수강평</p>
        </Link> */}
        <button onClick={executeScroll} className="tab text-black font-bold">
          {' '}
          수강평{' '}
        </button>
        <button onClick={moveChatRoom}>
          <a>
            <p className="tab text-black font-bold">문의 하기</p>
          </a>
        </button>
        {/* <p className="tab tab-active">Tab 2</p>
        <p className="tab">Tab 3</p> */}
      </div>
      <div className="flex w-full justify-start  pl-16">
        {lessonData && current === 'review' ? (
          <LessonReview commnets={lessonData.comments} start={start} Evaluation={Evaluation} />
        ) : (
          <div>
            <LessonIntoroduce lesson={lessonData} />
            <div ref={myRef}>
              <LessonReview commnets={lessonData?.comments} start={start} Evaluation={Evaluation} />
            </div>
          </div>
        )}

        <div className="relative">
          <div className="fixed  top-1/2 xl:right-60 md:right-0 lg:w-52  h-80 rounded-xl border-2 bg-gray-100 ">
            <div className="rounded-t-xl bg-red-500 h-8 text-white text-center font-bold">얼리버드 할인중</div>
            <div className="pt-5">
              <div className="text-center">
                <h3 className="text-center text-2xl font-bold">{`${lessonData?.price}원`}</h3>
                <span className="text-sm">Shooting Guard</span>
              </div>
              <div className="text-center p-2">
                <Link href={`/lessons/${lessonData?.id}/signup`}>
                  <button className="rounded-xl  w-full bg-green-500  py-2 text-white">수강신청 하기</button>
                </Link>
              </div>
              <div className="text-center p-2">
                <button className="rounded-xl  w-full border-2  py-2 text-black">바구니에 담기</button>
              </div>
            </div>
            <hr />
            <div className="flex flex-col pl-5">
              <span className="text-sm font-semibold">
                - 지식 공유자: {lessonData?.__teacher__.user.username.slice(0, 7)}
              </span>
              <span className="text-sm font-semibold">- 난이도</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
