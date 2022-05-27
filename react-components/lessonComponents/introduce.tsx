import ILesson from '@typings/ILesson';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

export interface LessonnIntroduceProps {
  lesson: ILesson;
}

const LessonIntroduce: FC<LessonnIntroduceProps> = ({ lesson }) => {
  const { t } = useTranslation('common');

  return (
    <div className="py-8 container mx-auto w-full  ">
      <div>
        <p className="font-bold text-xl text-black">{t(lesson.difficulty)}를 위해 준비한</p>
        <p className="font-bold text-xl text-black">{t(lesson.type)} 레슨입니다.</p>
      </div>
      <div className="py-8  w-2/3">
        <p className="break-all">{lesson.introduce}</p>
      </div>
      <div className="border-2 h-40 sm:h-48 rounded-xl flex flex-row p-4  w-2/3">
        <div className="flex flex-row items-center mr-6">
          <div className="flex flex-col items-center">
            ✍️
            <p className="font-bold text-md">이런걸 배워요</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 pt-10">
          <div className="flex flex-row gap-2">
            <AiOutlineCheck color="green" size={20} />
            <p className="font-semibold text-sm">{lesson.weLearnThis}</p>
          </div>
          {/* <div className="flex flex-row gap-2">
            <AiOutlineCheck color="green" size={20} /> <p className="font-semibold text-sm">재즈하고싶은신분</p>
          </div>
          <div className="flex flex-row gap-2">
            <AiOutlineCheck color="green" size={20} /> <p className="font-semibold text-sm">재즈하고싶은신분</p>
          </div> */}
        </div>
      </div>
      <div className="bg-gray-800 h-28 mt-5  w-2/3">
        <p className="font-bold text-md text-white text-center p-10 ">
          {t(lesson.type)} 연주자 라면 반드시 알아야 하는 기술
        </p>
      </div>
      {/* <div className="bg-gray-300 h-28 mt-5 p-5  w-2/3">
        <p className="font-bold text-md pl-4 text-green-700">📣 확인해주세요!</p>
        <p className="font-bold text-md text-black text-center text-sm ">
          본 강의는 재즈 완전 정복 시리즈의 6번째 강의입니다. 로드맵을 먼저 확인해주세요.
        </p>
      </div> */}
    </div>
  );
};

export default LessonIntroduce;
