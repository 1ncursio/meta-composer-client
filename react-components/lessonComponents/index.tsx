import ILesson from '@typings/ILesson';
import { getBackEndUrl } from '@utils/getEnv';
import optimizeImage from '@utils/optimizeImage';
import { randomInt } from 'crypto';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, useCallback, useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { RiDeleteBin2Line } from 'react-icons/ri';

export interface LessonProps {
  lesson: ILesson;
  show: boolean;
  wordCount: number;
  deleteWish?: (id: any) => void;
}

const LessonComponent: FC<LessonProps> = ({ lesson, show, wordCount, deleteWish }) => {
  const { t } = useTranslation('common');

  const [start, setStart] = useState<boolean[]>();

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      if (i + 1 < lesson.rating) {
        arr.push(true);
      } else {
        arr.push(false);
      }
    }
    setStart(arr);
  }, [lesson]);
  return (
    <div className=" relative flex flex-col items-center w-full h-3/4  ">
      {/* <a href="#"> */}
      <div className="avatar w-3/5  ">
        <div className="rounded-xl ">
          <img src={optimizeImage(lesson?.imageURL)} className="object-cover " />
        </div>
      </div>
      {/* <img src={lesson.imageURL} className="rounded-t-lg  w-2/5" /> */}
      {/* </a> */}
      <div className="text-center rounded-b-lg  w-4/5  ">
        <div className="flex flex-col gap-2">
          <div className="text-gray-700 h-16  lg:text-lg  font-bold md:text-xm ">{!show && lesson.name}</div>
          <p className="text-gray-400 text-sm font-light ">{lesson.__teacher__?.user.username}</p>
          <p className="text-blue-600 text-lg font-bold ">₩{lesson.price}</p>
        </div>
        <div className="rating rating-sm">
          <input type="radio" className="mask mask-star-2 bg-orange-400" />
          {start?.map((start, index) => {
            if (start) {
              return <div key={index} className="mask mask-star-2 bg-orange-400  w-4" />;
            } else {
              return <div key={index} className="mask mask-star-2 bg-orange-100  w-4" />;
            }
          })}
        </div>
      </div>
      {show && (
        <div className="w-full h-full">
          <div
            className=" absolute h-full w-full bg-black opacity-75  
		top-0 left-0 right-0 botton-0 text-center  "
          ></div>

          <div
            className=" absolute text-gray-900 
		   inset-0  w-full text-sm lg:text-xl  font-bold p-4 "
          >
            {' '}
            <Link href={'/lessons/' + lesson.id}>
              <a href="">
                <div>
                  <p className="text-white">{lesson.name}</p>
                  <br></br>
                  <p className="text-xs lg:text-sm  text-cyan-200">
                    {lesson.introduce.length > 100 ? lesson.introduce.slice(0, wordCount) + '...' : lesson.introduce}
                  </p>
                </div>
              </a>
            </Link>
            <br />
            <div className="hidden lg:flex justify-between items-center">
              <div className="badge badge-ghost">{t(lesson.type)}</div>
              {deleteWish && (
                <button onClick={() => deleteWish(lesson.id)}>
                  <RiDeleteBin2Line size={30} color="white" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonComponent;
