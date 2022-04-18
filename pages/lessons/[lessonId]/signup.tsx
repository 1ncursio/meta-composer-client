import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import LessonIntoroduce from '@react-components/lessonComponents/introduce';
import LessonReview from '@react-components/lessonComponents/review';
import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import useSWR from 'swr';
import { RequestPayParams, RequestPayResponse } from 'iamport-typings';
import useUserSWR from '@hooks/swr/useUserSWR';
import { useForm } from 'react-hook-form';
import useStore from '@store/useStore';
export interface ISignupForm {
  buyer_name: string;
  buyer_tel: string;
  buyer_email: string;
  check: boolean;
}

const LessonSignup = () => {
  const router = useRouter();
  const { lessonId } = router.query;
  const { data: lessonData, mutate: mutateLessonData } = useSWR<ILesson>('/lessons/' + lessonId, fetcher);
  const { data: userData } = useUserSWR();
  const { register, handleSubmit, setValue } = useForm<ISignupForm>({
    reValidateMode: 'onSubmit',
    shouldUseNativeValidation: true,
  });
  const { signupLoad } = useStore((state) => state.signup);
  useEffect(() => {
    if (!userData) return;
    setValue('buyer_name', userData.username);
    setValue('buyer_email', userData.email);
  }, [userData]);

  const pay = useCallback(
    async (data: ISignupForm) => {
      if (typeof lessonId === 'string') {
        console.log(typeof parseInt(lessonId));
        signupLoad({ data, lessonId: parseInt(lessonId) });
      }
      // const test: ISignupForm = {
      //   buyer_name: '@',
      //   buyer_tel: '@323',
      //   buyer_email: '22',
      //   check: true,
      // };
    },
    [lessonId],
  );

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
                <img src={lessonData?.imageURL} className="object-cover " />
              </div>
            </div>
            <p>{lessonData?.name}</p>
            <div className="p-2 flex-col items-center ">
              <p className=" font-bold text-lg text-right">₩{lessonData?.price}</p>
              <div className="rounded-lg border-2 font-bold  sm:text-xs w-full">위시리스트 추가</div>

              {/* <div className="badge badge-outline font-lg md:font-xm">위시리스트로 이동</div> */}
            </div>
          </div>
        </div>
        {/* hidden md:fixed  */}
        <form
          onSubmit={handleSubmit(pay)}
          className="fixed  lg:flex  top-48  border-2  w-60 left-2/3 flex flex-col rounded-md"
        >
          <div className="flex flex-row  justify-between text-xl font-bold p-2">
            <p>총계</p>
            <p>₩53,900</p>
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
