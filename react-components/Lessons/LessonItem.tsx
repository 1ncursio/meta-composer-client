import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import { FC } from 'react';
import useSWR from 'swr';
import { Lesson } from '.';

export interface LessonItemProps {
  lesson: Lesson;
}
const LessonItem: FC<LessonItemProps> = ({ lesson }) => {
  const { data: lessonData, mutate } = useSWR<Lesson[]>('http://localhost:4000/api/lessons', fetcher);

  const onDelete = (id: number) => {
    client
      .delete(`lessons/${id}`)
      .then((res) => {
        alert('레슨이 삭제되었습니다');
        const check = lessonData?.filter((lesson) => lesson.id !== id);
        mutate(check, false);
        console.log(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{lesson.name}</h2>
        <p>{lesson.introduce}</p>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            onDelete(lesson.id);
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default LessonItem;
