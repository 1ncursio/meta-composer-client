import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

export interface LessonnItoroduceProps {
  lesson: ILesson | undefined;
}

const LessonIntoroduce: FC<LessonnItoroduceProps> = ({ lesson }) => {
  return (
    <div className="py-8 w-full  p-20 ">
      <div>
        <p className="font-bold text-xl text-black">[**] 를 위해 준비한 </p>
        <p className="font-bold text-xl text-black"> [***] 레슨 입니다.</p>
      </div>
      <div className="py-8  w-80 ">
        <p className="break-words font-bold ">{lesson.introduce}</p>
      </div>
      <div className="border-2 h-40 sm:h-48 rounded-xl flex flex-row p-4">
        <div className="flex flex-row items-center mr-6">
          <div className="flex flex-col items-center">
            ✍️
            <p className="font-bold text-md">이런걸 배워요</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 pt-10">
          <div className="flex flex-row gap-2 ">
            <AiOutlineCheck color="green" size={20} />
            <p className="font-semibold text-sm">재즈하고싶은신분</p>
          </div>
          <div className="flex flex-row gap-2">
            <AiOutlineCheck color="green" size={20} /> <p className="font-semibold text-sm">재즈하고싶은신분</p>
          </div>
          <div className="flex flex-row gap-2">
            <AiOutlineCheck color="green" size={20} /> <p className="font-semibold text-sm">재즈하고싶은신분</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 h-28 mt-5">
        <p className="font-bold text-md text-white text-center p-10 ">재즈 연주자 라면 반드시 알아야 하는 기술</p>
      </div>
      <div className="bg-gray-300 h-28 mt-5 p-5 ">
        <p className="font-bold text-md text-white pl-4 text-green-700">📣 확인해주세요!</p>
        <p className="font-bold text-md text-black text-center text-sm ">
          본 강의는 재즈 완전 정복 시리즈의 6번째 강의입니다. 로드맵을 먼저 확인해주세요.
        </p>
      </div>
    </div>
  );
};

export default LessonIntoroduce;
