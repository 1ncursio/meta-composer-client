import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import ISignup from '@typings/ISignup';
import optimizeImage from '@utils/optimizeImage';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import useSWR from 'swr';

const DashboardMain = () => {
  const { data: userData } = useUserSWR();
  const { data: signUpData, mutate: mutateLessonData } = useSWR<ISignup[]>('/signup-timetables', fetcher);

  const viewSingup = useMemo(() => {
    if (!signUpData || signUpData?.length < 1)
      return { closeSignup: null, lesson: 0, finishedCount: 0, date: `아직 없습니다` };

    const row = new Date();
    let max = new Date(row.getFullYear() + 2, 1, 1);
    let closeSignup = signUpData[0];
    signUpData?.forEach((signup) => {
      signup.signuptimetables.forEach((table) => {
        const time = new Date(table.time);
        if (row < time && max > time) {
          max = time;
          closeSignup = signup;
        }
      });
    });

    const lesson = closeSignup.signuptimetables.length;
    const finishedCount = closeSignup.signuptimetables.filter((table) => {
      return new Date(table.time) < row;
    }).length;

    return { closeSignup, lesson, finishedCount, date: `${max.getMonth() + 1}월 ${max.getDate()}일` };
  }, [signUpData]);

  return (
    <div className="w-4/5 h-full">
      <div className="w-full h-12 bg-gray-600 text-white font-bold text-xl flex items-center pl-10 mb-6">대시보드</div>
      <div className="grid grid-cols-2 mx-auto  w-full lg:w-2/3 h-full gap-x-4 gap-y-4 ">
        {/* 프로필 */}
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 rounded">
          <p className="font-bold text-md">😀{userData?.username}</p>
          <div className="flex h-20 w-full gap-2">
            {userData?.profile_image && (
              <Image
                src={userData!.profile_image}
                alt="user profile"
                //   placeholder="blur"
                // layout="fill"
                width={64}
                height={64}
                className="mask mask-squircle"
              />
            )}
            <p className="font-bold text-lg ">{userData?.username} 님, 오늘 하루 화이팅!</p>
          </div>
          <div className="h-full  w-full flex flex-col-reverse ">
            <div className="w-full flex flex-row-reverse">
              <Link href="/my-profile">
                <a className=" text-gray-400">프로필 수정하기</a>
              </Link>
              {/* <button className=" text-gray-400">프로필 수정하기 </button> */}
            </div>
          </div>
        </div>
        {/* 바로다음 레슨 */}
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between rounded">
          <p className="font-bold text-md">📖다음 레슨</p>
          <div className="flex items-end gap-2">
            <p className="font-bold text-md">
              {viewSingup.closeSignup ? viewSingup.closeSignup?.__lesson__.name : '아직 없습니다'}
            </p>
            <p className=" text-xs">({viewSingup?.date})</p>
          </div>
          <div className="w-full">
            {viewSingup && (
              <p>
                진도율: {'   '}
                {viewSingup.finishedCount}/{viewSingup.lesson}
                {'   '}({(viewSingup.finishedCount / viewSingup!.lesson) * 100}%)
              </p>
            )}

            {viewSingup && (
              <progress
                className="progress w-3/4"
                value={(viewSingup.finishedCount / viewSingup!.lesson) * 100}
                max="100"
              ></progress>
            )}

            <div className="w-full flex flex-row-reverse">
              <Link href={viewSingup.closeSignup ? `/lessons/${viewSingup.closeSignup.__lesson__.id}` : `/lessons`}>
                <a className="btn btn-error btn-sm">레슨 하러가기</a>
              </Link>
              {/* <button className="btn btn-error btn-sm">레슨 하러가기</button> */}
              <button className="btn btn-success btn-sm">내모든 레슨</button>
            </div>
          </div>
        </div>
        {/* 내노트  */}
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between rounded">
          <p className="font-bold text-md">📝최근 내 노트</p>
        </div>
        {/* 학습통계 */}
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between rounded">
          <p className="font-bold text-md">🏃🏻학습 통계</p>
          <div className="flex w-full my-auto justify-between">
            <div>
              <p className="text-center text-5xl font-bold text-gray-400">0</p>
              <p className="text-xs lg:text-base">완료 레슨수</p>
            </div>
            <div>
              <p className="text-center text-5xl font-bold text-gray-400">0</p>
              <p className="text-xs lg:text-base">완료 수업수</p>
            </div>
            <div>
              <p className="text-center text-5xl font-bold text-gray-400">0</p>
              <p className="text-xs lg:text-base">획득 수료증</p>
            </div>
          </div>
        </div>
        {/* 콩쿨 */}
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between rounded">
          <p className="font-bold text-md">🏆My competition</p>
        </div>
        {/* 완료한 강의 */}
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between rounded">
          <p className="font-bold text-md">🎓완료한 강의</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
