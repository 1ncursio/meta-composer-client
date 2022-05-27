import client from '@lib/api/client';
import ILesson from '@typings/ILesson';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

export interface LessonSignupCardProps {
  lesson: ILesson;
}

const LessonSignupCard: FC<LessonSignupCardProps> = ({ lesson }) => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const { lessonId } = router.query;

  const addToWishList = useCallback(async () => {
    try {
      const { data } = await client.post(`/wishlists/${lessonId}`);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, [lessonId]);

  return (
    <div className="relative">
      <div className="fixed top-1/2 xl:right-60 md:right-0 lg:w-52 h-80 rounded-xl border-2 bg-gray-100">
        <div className="rounded-t-xl bg-error h-8 text-white font-bold flex justify-center items-center">
          얼리버드 할인중
        </div>
        <div className="pt-5">
          <div className="text-center">
            <h3 className="text-center text-2xl font-bold">{`${lesson.price}원`}</h3>
            <span className="text-sm">{lesson.name}</span>
          </div>
          <div className="p-2">
            <Link href={`/lessons/${lesson.id}/signup`}>
              <a>
                <button className="btn btn-primary btn-block">수강신청</button>
              </a>
            </Link>
          </div>
          <div className="text-center p-2">
            <button onClick={addToWishList} className="btn btn-ghost btn-outline btn-sm btn-block">
              위시리스트 추가
            </button>
          </div>
        </div>
        <hr />
        <div className="pl-5">
          <div className="flex gap-2 text-sm">
            <span className="font-semibold">- 선생님: </span>
            <span>{lesson.__teacher__.user.username}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="font-semibold">- 난이도: </span>
            <span>{t(lesson.difficulty)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonSignupCard;
