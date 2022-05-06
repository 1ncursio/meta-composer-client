import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import ISignup from '@typings/ISignup';
import optimizeImage from '@utils/optimizeImage';
import dayjs from 'dayjs';
import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import useSWR from 'swr';

const DashboardMain = () => {
  const { data: userData } = useUserSWR();
  const { data: signUpData, mutate: mutateLessonData } = useSWR<ISignup[]>('/signup-timetables', fetcher);
  useEffect(() => {
    if (!signUpData) return;
    const row = new Date();
    let max = new Date(row.getFullYear() + 2, 1, 1);
    let closeSignup = null;
    signUpData?.forEach((signup) => {
      signup.signuptimetables.forEach((table) => {
        const time = new Date(table.time);
        if (row < time && max > time) {
          max = time;
          closeSignup = signup;
        }
      });
    });
    console.log(closeSignup);
  }, [signUpData]);

  const viewSingup = useMemo(() => {
    if (!signUpData) return;
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
    // console.log((max.getTime() - row.getTime()) / (1000 * 60 * 60 * 24));

    const lesson = closeSignup.signuptimetables.length;
    // const finishedCount = closeSignup.signuptimetables.filter((table) => {
    //   return new Date(table.time) < row;
    // }).length;
    const finishedCount = 40;
    return { closeSignup, lesson, finishedCount, date: `${max.getMonth() + 1}월 ${max.getDate()}일` };
  }, [signUpData]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-12 bg-gray-600 text-white font-bold text-xl flex items-center pl-10 mb-6">대시보드</div>
      <div className="grid grid-cols-2 mx-auto  w-full lg:w-2/3 h-full gap-x-2 gap-y-2 ">
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2">
          <p className="font-bold text-md">😀{userData?.username}</p>
          <div className="flex h-20 w-full gap-2">
            {userData?.profile_image && (
              <Image
                src={userData!.profile_image}
                alt="user profile"
                //   placeholder="blur"
                // layout=''
                width={100}
                height={64}
                className="mask mask-squircle"
              />
            )}
            <p className="font-bold text-lg ">{userData?.username} 님, 오늘 하루 화이팅!</p>
          </div>
          <div className="h-full  w-full flex flex-col-reverse">
            <div className="w-full flex flex-row-reverse">
              <button className=" text-gray-400">프로필 수정하기 </button>
            </div>
          </div>
        </div>
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between">
          <p className="font-bold text-md">📖다음 레슨</p>
          <div className="flex items-end gap-2">
            <p className="font-bold text-md">{viewSingup?.closeSignup.__lesson__.name}</p>
            <p className=" text-xs">({viewSingup?.date})</p>
          </div>
          <div className="w-full">
            <p>
              진도율: {'   '}
              {viewSingup!.finishedCount}/{viewSingup!.lesson}
              {'   '}({(viewSingup!.finishedCount / viewSingup!.lesson) * 100}%)
            </p>

            <progress
              className="progress w-3/4"
              value={(viewSingup!.finishedCount / viewSingup!.lesson) * 100}
              max="100"
            ></progress>

            <div className="w-full flex flex-row-reverse">
              <button className="btn btn-error btn-sm">레슨 하러가기</button>
              <button className="btn btn-success btn-sm">내모든 레슨</button>
            </div>
          </div>
        </div>
        <div className="w-full h-48 border flex flex-col gap-y-2 p-2 justify-between">
          <p className="font-bold text-md">📝최근 내 노트</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
