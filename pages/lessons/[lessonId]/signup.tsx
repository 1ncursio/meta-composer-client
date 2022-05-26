import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import LessonIntroduce from '@react-components/lessonComponents/introduce';
import LessonReview from '@react-components/lessonComponents/review';
import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import useSWR from 'swr';
import { RequestPayParams, RequestPayResponse } from 'iamport-typings';
import useUserSWR from '@hooks/swr/useUserSWR';
import { useForm } from 'react-hook-form';
import useStore from '@store/useStore';
import { useSchedulePicker } from '@hooks/useSchedulePicker';
import ScheduluePicker from '@react-components/SchedulePicker';
import produce from 'immer';
import dayjs from 'dayjs';
import { json } from 'stream/consumers';
import Cdatjs from 'dayjs/plugin/customParseFormat';
import optimizeImage from '@utils/optimizeImage';
export interface ISignupForm {
  buyer_name: string;
  buyer_tel: string;
  buyer_email: string;
  check: boolean;
  Lmonth: number;
  Lstartdate: string;
  submitDays: SumitDays[];
  PaymentAmount: number;
}

export interface SumitDays {
  Lday: string;
  Ltime: string;
}

const LessonSignup = () => {
  const router = useRouter();
  const { lessonId } = router.query;
  const { data: lessonData, mutate: mutateLessonData } = useSWR<ILesson>(
    lessonId ? '/lessons/' + lessonId : null,
    fetcher,
  );
  const { data: userData } = useUserSWR();
  const { register, handleSubmit, setValue, watch } = useForm<ISignupForm>({
    reValidateMode: 'onSubmit',
    shouldUseNativeValidation: true,
  });
  const { signupLoad } = useStore((state) => state.signup);
  const { days, times, setTimeTableList, timeTableList } = useSchedulePicker();
  const WeekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [check, setCheck] = useState(true);

  const submitDays = useMemo(() => {
    const result: SumitDays[] = [];
    timeTableList.forEach((Ctime) => {
      Ctime.isSelectDays.forEach((day, index2) => {
        if (day) {
          result.push({
            Lday: WeekDay[index2],
            Ltime: Ctime.time.hour() > 9 ? `${Ctime.time.hour()}:00:00` : `0${Ctime.time.hour()}:00:00`,
          });
        }
      });
    });
    return result;
  }, [timeTableList]);

  const onClickTimeButton = useCallback(
    (day: number, time: dayjs.Dayjs) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!setTimeTableList) return;
      setTimeTableList(
        produce((draft) => {
          draft.forEach((item) => {
            if (item.time.isSame(time) && item.isAvailableByWeekDays[day - 1] && !item.isEmpty[day - 1]) {
              if (item.isSelectDays) {
                item.isSelectDays[day - 1] = !item.isSelectDays[day - 1];
              }
            }
          });
        }),
      );
    },
    [setTimeTableList],
  );

  useEffect(() => {
    if (!lessonData) return;
    if (!check) return;
    console.log(lessonData);
    setTimeTableList(
      produce((draft) => {
        draft.forEach((item) => {
          lessonData.timeTables.forEach((time) => {
            if (item.time.isSame(dayjs(`${dayjs().format('YYYY-MM-DD')} ${time.time}`))) {
              item.isAvailableByWeekDays[WeekDay.indexOf(time.day)] =
                !item.isAvailableByWeekDays[WeekDay.indexOf(time.day)];
              if (time.signupId !== null) {
                item.isEmpty[WeekDay.indexOf(time.day)] = true;
              }
            }
          });
        });
      }),
    );
    setCheck(false);
  }, [lessonData, check]);

  useEffect(() => {
    if (!userData) return;
    setValue('buyer_name', userData.username);
    setValue('buyer_email', userData.email);
    setValue('Lmonth', 1);
  }, [userData]);

  const pay = useCallback(
    async (data: ISignupForm) => {
      if (typeof lessonId === 'string' && lessonData) {
        if (submitDays.length < 1) {
          return alert('선택된 시간이 없습니다');
        }
        data.submitDays = submitDays;
        data.PaymentAmount = submitDays.length * lessonData?.price * watch('Lmonth');
        data.Lstartdate = dayjs().format('YYYY-MM-DD');
        signupLoad({ data, lessonId: parseInt(lessonId), router });
      }
    },
    [lessonId, submitDays, lessonData],
  );

  const lessonLength = useMemo(() => {
    if (!lessonData) return 60;
    dayjs.extend(Cdatjs);
    return dayjs(lessonData.length, 'HH:mm:ss').hour() * 60;
  }, [lessonData]);

  return (
    <div className="container w-full flex flex-col p-10 ">
      <div className="flex flex-row items-start mb-10  w-full">
        <div className="w-2/3 flex flex-col gap-y-2 mx-auto">
          <p className="font-bold text-lg">레슨 신청</p>
          <div className="flex flex-row items-center text-center">
            <p className="font-medium  text-sm ">내 위시리스트</p>
            <AiOutlineHeart />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center  w-full">
        <div className="flex flex-col mx-auto w-2/3">
          <div className="w-3/4 border-2 h-12 flex flex-row justify-between">
            <p className="font-bold  p-2">강의정보</p>
            <p className="font-medium text-sm  p-3">삭제</p>
          </div>
          <div className="w-3/4  border-2 h-28 flex flex-row  justify-between gap-3">
            <div className="avatar w-1/4  p-2">
              <div className="">
                {lessonData && lessonData?.imageURL && (
                  <img src={optimizeImage(lessonData?.imageURL)} className="object-cover " />
                )}
              </div>
            </div>
            <p>{lessonData?.name}</p>
            <div className="p-2 flex-col items-center ">
              <p className=" font-bold text-lg text-right">₩{lessonData?.price}</p>
              <div className="rounded-lg border-2 font-bold  sm:text-xs w-full">위시리스트 추가</div>

              {/* <div className="badge badge-outline font-lg md:font-xm">위시리스트로 이동</div> */}
            </div>
          </div>
          <div className="w-3/4 flex flex-col items-center gap-y-2">
            <p className="text-center m-2 font-bold text-lg border-2 p-2 rounded-md bg-gray-200">레슨 시간 선택</p>
            <div className="w-full flex gap-2 flex-row-reverse mb-4">
              <div className="flex flex-row items-center">
                <div className="bg-red-700 h-4 w-4"></div>
                <p className="text-sm font-bold">수강중</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-primary h-4 w-4"></div>
                <p className="text-sm font-bold">수강가능</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-red-400 h-4 w-4"></div>
                <p className="text-sm font-bold">선택됨</p>
              </div>
            </div>
            <div className="flex flex-row-reverse w-full">
              <select {...register('Lmonth')} className="select select-bordered w-24">
                <option selected value={1}>
                  1개월
                </option>
                <option value={2}>2개월</option>
                <option value={3}>3개월</option>
                <option value={4}>4개월</option>
                <option value={5}>5개월</option>
                <option value={6}>6개월</option>
              </select>
            </div>

            <div className="border-2 w-full">
              <ScheduluePicker
                step={lessonLength}
                onClickTimeButton={onClickTimeButton}
                timeTableList={timeTableList}
                setTimeTableList={setTimeTableList}
                days={days}
                times={times}
              />
            </div>
          </div>
        </div>
        {/* hidden md:fixed  */}
        <form
          onSubmit={handleSubmit(pay)}
          className="fixed  lg:flex  top-48  border-2  w-60 left-2/3 flex flex-col rounded-md"
        >
          <div className="flex flex-row  justify-between text-xl font-bold p-2">
            <div className="flex flex-row items-end">
              <p>총계</p>

              <p className="text-xs">{watch('Lmonth')}개월</p>
            </div>
            <p>₩{lessonData && submitDays.length * lessonData?.price * watch('Lmonth')}</p>
          </div>
          <div className="p-2 text-sm">
            <p>이름</p>
            <input {...register('buyer_name')} className="border-2 bg-gray-200 w-full h-8 rounded p-2" type="text" />
          </div>
          <div className="p-2 text-sm">
            <p>휴대폰 번호</p>
            <div className="flex flex-row border-2 rounded-md">
              <select name="" id="">
                <option value="82">+82</option>
                <option value="82">+81</option>
              </select>
              <p className="text-lg font-bold">|</p>
              <input {...(register('buyer_tel'), { required: true })} className="  w-3/4 h-8 " type="text" />
            </div>
          </div>
          <div className="p-2 text-sm">
            <p>이메일 주소</p>
            <input {...register('buyer_email')} className="border-2 bg-gray-200 w-full h-8 rounded p-2" type="text" />
          </div>
          <div className="p-2 text-xs flex flex-row">
            <input {...(register('check'), { required: true })} type="checkbox" className="checkbox w-5 h-5" />
            <p>(필수) 구매조건 및 개인정보취급방침 동의 </p>
          </div>
          <div className="text-center p-2">
            <button className="rounded-xl  w-full bg-green-500  py-2 text-white">결제하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonSignup;
