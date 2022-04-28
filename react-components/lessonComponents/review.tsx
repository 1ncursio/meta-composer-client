import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { AiFillExclamationCircle, AiOutlineCheck } from 'react-icons/ai';
import { Comment } from '@typings/ILesson';
import Image from 'next/image';
import dayjs from 'dayjs';
export interface LessonnReviewProps {
  commnets: Comment[] | undefined;
  start: boolean[] | undefined;
  Evaluation: number;
}

const LessonReview: FC<LessonnReviewProps> = ({ commnets, start, Evaluation }) => {
  useEffect(() => {
    console.log(commnets);
  }, [commnets]);

  return (
    <div className="py-8 container mx-auto ">
      <div className="w-2/3   flex flex-col gap-y-2">
        <div className="flex flex-row text-xl items-end gap-x-2">
          <p className="font-bold">수강평</p>
          <p className="text-gray-300 text-sm font-bold ">총 {commnets?.length}개</p>
        </div>
        <p className="text-sm"> 수강생분들이 직접 작성하신 수강평입니다. 수강평을 작성 시 300잎이 적립됩니다.</p>
        {/* text-xl lg:flex flex-row gap-x-2 sm:flex flex-row gap-y-2 */}
        <div className="text-xl flex flex-row gap-x-2 ">
          <div
            className="w-1/4  h-40 flex flex-col items-center py-5
          border-2 rounded "
          >
            <p className="text-3xl font-bold ">{Evaluation}</p>
            <div className="rating rating-sm mb-4">
              <input type="radio" className="mask mask-star-2 bg-orange-400" readOnly />
              {start?.map((start, index) => {
                if (start) {
                  return <div key={index} className="mask mask-star-2 bg-orange-400  w-4" />;
                } else {
                  return <div key={index} className="mask mask-star-2 bg-orange-100  w-4" />;
                }
              })}
            </div>
            <p className="text-gray-300 text-sm font-bold ">{commnets?.length}개의 수강평</p>
          </div>
          <div className="w-3/4 h-40  bg-gray-300 flex flex-col justify-center rounded">
            {[0, 0, 0, 0, 0].map((temp, index) => (
              <div key={index} className="flex flex-row items-center gap-2 w-full justify-center">
                <p className="text-sm font-bold">{5 - index}점</p>
                <progress
                  className="progress progress-warning w-2/3"
                  value={
                    commnets?.filter((co) => {
                      return co.rating === 5 - index;
                    }).length
                  }
                  max={commnets?.length}
                ></progress>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-2/3  flex flex-col gap-y-2  py-5 mt-3 border-t border-black ">
        {commnets && commnets?.length > 1 ? (
          commnets.map((com) => {
            return (
              <div key={com.id} className="flex flex-col w-full gap-2 border-b-2 p-2">
                <div className="flex items-center gap-2">
                  {com.user.profile_image ? (
                    <Image
                      width={32}
                      height={32}
                      src={com.user.profile_image}
                      alt="user profile"
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="rounded-full w-8 h-8 bg-accent inline-flex justify-center items-center text-sm font-light text-white">
                      {com.user.username[0]}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="rating rating-sm ">
                      <input type="radio" className="mask mask-star-2 bg-orange-400" readOnly />
                      {start?.map((start, index) => {
                        if (index < com.rating) {
                          return <div key={index} className="mask mask-star-2 bg-orange-400  w-4" />;
                        } else {
                          return <div key={index} className="mask mask-star-2 bg-orange-100  w-4" />;
                        }
                      })}
                    </div>

                    <p className="font-bold text-sm text-gray-500">{com.user.username}</p>
                  </div>
                </div>
                <p>{com.contents}</p>

                <p className="font-bold text-xs text-gray-300">{dayjs(com.created_at).format('YYYY-MM-DD')}</p>
              </div>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <AiFillExclamationCircle size={60} />
            아직 등록된 수강 후기가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonReview;
