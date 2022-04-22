import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { Comment } from '@typings/ILesson';
export interface LessonnReviewProps {
  commnets: Comment[] | undefined;
}

const LessonReview: FC<LessonnReviewProps> = ({ commnets }) => {
  useEffect(() => {
    console.log(commnets, '!!!!');
  }, [commnets]);
  return (
    <div className="py-8 container mx-auto ">
      <div className="w-2/3 bg-red-400  flex flex-col gap-y-2">
        <div className="flex flex-row text-xl items-end gap-x-2">
          <p className="font-bold">수강평</p>
          <p className="text-gray-300 text-sm ">총 {commnets?.length}개</p>
        </div>
        <p className="text-sm"> 수강생분들이 직접 작성하신 수강평입니다. 수강평을 작성 시 300잎이 적립됩니다.</p>
        {/* text-xl lg:flex flex-row gap-x-2 sm:flex flex-row gap-y-2 */}
        <div className="text-xl flex flex-row gap-x-2 ">
          <div className="w-1/4 bg-blue-200 h-40 flex flex-col items-center py-5">
            <p className="text-3xl font-bold ">5.0</p>
            <p className="text-gray-300 text-sm ">{commnets?.length}개의 수강평</p>
          </div>
          <div className="w-3/4 bg-blue-200 h-40"></div>
        </div>
      </div>
      {/* {commnets &&
        commnets.map((com) => {
          return (
            <div key={com.id} className="bg-blue-400">
              ssdfdfd
            </div>
          );
        })} */}
    </div>
  );
};

export default LessonReview;
