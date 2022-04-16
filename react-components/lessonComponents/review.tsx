import ILesson from '@typings/ILesson';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { Comment } from '@typings/ILesson';
export interface LessonnReviewProps {
  commnets: Comment[];
}

const LessonReview: FC<LessonnReviewProps> = ({ commnets }) => {
  useEffect(() => {
    console.log(commnets[0]);
  }, [commnets]);
  return (
    <div className="py-8 w-2/3   p-20">
      {commnets.map((com) => {
        return (
          <div key={com.id} className="h-20 w-96 bg-blue-400">
            ss
          </div>
        );
      })}
    </div>
  );
};

export default LessonReview;
