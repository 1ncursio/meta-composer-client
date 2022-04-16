import fetcher from '@lib/api/fetcher';
import LessonIntoroduce from '@react-components/lessonComponents/introduce';
import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useSWR from 'swr';

const LessonPage = () => {
  const router = useRouter();
  const { lessonId } = router.query;
  const { data: lessonData, mutate: mutateLessonData } = useSWR<ILesson>('/lessons/' + lessonId, fetcher);
  useEffect(() => {
    console.log(lessonData);
  }, [lessonData]);
  return (
    <div className=" w-full h-full">
      <div className="h-80 w-100 bg-gray-700  pt-12 pl-4">
        {/* <img src={lessonData?.imageURL} className="h-3/4 w-1/3"></img> */}
        <div className="flex flex-row">
          <div className="avatar ">
            <div className="ml-28 w-80 h-52 rounded-xl">
              <img src={lessonData?.imageURL} />
            </div>
          </div>
          <div className="flex flex-col ml-5">
            <p className="text-sm font-semibold text-white">{lessonData?.type}</p>
            <p className="text-lg font-extrabold text-white mb-10">{lessonData?.name}</p>
            <p className="text-xs font-semibold text-white">{lessonData?.__teacher__.user.username}</p>
          </div>
        </div>
      </div>
      <div className="tabs border-b-2  mt-2  ">
        <Link href={`/lessons/${lessonId}`}>
          <p className="tab ml-16 text-black font-bold">강의 소개</p>
        </Link>
        <Link href={`/lessons/${lessonId}?type=tnd`}>
          <p className="tab text-black font-bold">수강평</p>
        </Link>
        <Link href={`/lessons/${lessonId}`}>
          <p className="tab text-black font-bold">수강전 문의</p>
        </Link>
        {/* <p className="tab tab-active">Tab 2</p>
        <p className="tab">Tab 3</p> */}
      </div>
      <div className="flex w-screen justify-center ">
        <div className="flex flex-row">
          {lessonData && <LessonIntoroduce lesson={lessonData} />}
          {/* </div> */}
          {/* <div className="relative w-1/2  "> */}
          <div className=" w-52  h-80   rounded-xl border-2 bg-gray-100 ">
            <div className="rounded-t-xl bg-red-500 h-8 text-white text-center font-bold">얼리버드 할인중</div>
            <div className="pt-5">
              <div className="text-center">
                <h3 className="text-center text-2xl font-bold">{`${lessonData?.price}원`}</h3>
                <span className="text-sm">Shooting Guard</span>
              </div>
              <div className="text-center p-2">
                <button className="rounded-xl  w-full bg-green-500  py-2 text-white">수강신청 하기</button>
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
