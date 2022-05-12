import { useSchedulePicker } from '@hooks/useSchedulePicker';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import ScheduluePicker from '@react-components/SchedulePicker';
import dayjs from 'dayjs';
import produce from 'immer';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { Lesson } from '.';

export interface ILessonForm {
  name: string;
  introduce: string;
  // 레슨 길이 (분 단위) e.g. 60 = 1시간, 30 = 30분
  length: number;
  price: number;
  type: string;
  difficulty: string;
  weLearnThis: string;
  checkPlease: string;
}

const CreateLessons = () => {
  const { data: lessonData, mutate } = useSWR<Lesson[]>('/lessons?perPage=8&page=1', fetcher);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ILessonForm>();
  const { days, times, onClickTimeButton, setTimeTableList, timeTableList } = useSchedulePicker();

  const [thumbnailImageSrc, setThumbnailImageSrc] = useState<string>('');
  const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(null);

  const saveFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const a = e.target.files[0];
    setThumbnailImageFile(a);
    setThumbnailImageSrc(URL.createObjectURL(e.target.files[0]));
  };

  const deleteFileImage = () => {
    URL.revokeObjectURL(thumbnailImageSrc);
    setThumbnailImageSrc('');
  };

  const onSubmit = (data: ILessonForm) => {
    if (!thumbnailImageFile) {
      console.log('썸네일 이미지 파일이 없습니다.');
      return;
    }

    const { name, introduce, length, price, type, checkPlease, difficulty, weLearnThis } = data;
    console.log(data);

    const hour = Math.floor(length / 60);
    const minute = length % 60;

    console.log({ hour, minute });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('introduce', introduce);
    formData.append('length', dayjs(`2000-01-01 ${hour}:${minute}:00`).format('HH:mm:ss'));
    formData.append('price', price.toString());
    formData.append('type', type);
    formData.append('image', thumbnailImageFile);
    formData.append('day', JSON.stringify(days));
    formData.append('time', JSON.stringify(times));
    formData.append('checkPlease', checkPlease);
    formData.append('difficulty', difficulty);
    formData.append('weLearnThis', weLearnThis);

    // console.log({ formData: formData.get('length') });
    // return;

    client
      .post('lessons', formData)
      .then((res) => {
        console.log({ res });
        // mutate();
        // produce((draft) => {
        //   draft.push(res.data.payload);
        //   console.log(res.data.payload);
        // }),
        // false,
        Router.push(`/lessons/${res.data.payload.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
    reset();
  };

  useEffect(() => {
    if (lessonData) console.log(lessonData);
  }, [lessonData]);

  const moveRouter = () => {
    Router.push('/lessons');
  };

  return (
    <div className="container mx-auto">
      <ul>
        <h1 className="pb-8">Create Lessons</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div>
              <label className="input-group input-group-vertical">레슨 이름</label>
              <input
                type="text"
                placeholder="name"
                {...register('name')}
                autoComplete="off"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label>이미지 첨부</label>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div id="image">
                        {thumbnailImageSrc && <img alt="sample" src={thumbnailImageSrc} style={{ margin: 'auto' }} />}
                        <div
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <input id="image" name="imgUpload" type="file" accept="image/*" onChange={saveFileImage} />

                          <button className="btn" onClick={() => deleteFileImage()}>
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <label className="input-group input-group-vertical">난이도</label>
              <select
                id="lessonType"
                {...register('difficulty')}
                className="input input-sm input-bordered w-full max-w-xs"
              >
                <option value="beginner">입문자</option>
                <option value="intermediate">중급자</option>
                <option value="advanced">숙련자</option>
              </select>
            </div>
            <div>
              <label className="input-group input-group-vertical">이런 걸 배워요!</label>
              <input
                type="text"
                placeholder="이런 걸 배워요!"
                {...register('weLearnThis')}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="input-group input-group-vertical">확인 사항</label>
              <input
                type="text"
                placeholder="확인 사항"
                {...register('checkPlease')}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <label className="input-group input-group-vertical">가격</label>
            <input
              type="number"
              placeholder="숫자만 입력하세요"
              {...register('price', {
                valueAsNumber: true,
              })}
              className="input input-bordered w-full max-w-xs"
            />
            <br />
            <label className="input-group input-group-vertical">레슨 타입</label>
            <select id="lessonType" {...register('type')} className="input input-sm input-bordered w-full max-w-xs">
              <option value="Sonata">Sonata</option>
              <option value="Etudes">Etudes</option>
              <option value="Waltzes">Waltzes</option>
              <option value="Nocturnes">Nocturnes</option>
              <option value="Marches">Marches</option>
            </select>
            <br />
            {/* <div className="relative">
              <label className="input-group input-group-vertical">레슨 일정</label>
              <select id="day" {...register('day')} className="input input-bordered w-full max-w-xs">
                <option value="1">일</option>
                <option value="2">월</option>
                <option value="3">화</option>
                <option value="4">수</option>
                <option value="5">목</option>
                <option value="6">금</option>
                <option value="7">토</option>
              </select>

              <br />
              <label className="input-group input-group-vertical">레슨 시간</label>
              <input type="time" step="2" {...register('time')} />
            </div> */}
            <label className="input-group input-group-vertical">레슨 진행 시간</label>
            <input
              // type="datetime"
              placeholder="length"
              {...register('length', {
                value: 60,
                min: 30,
              })}
              className="input input-bordered w-full max-w-xs"
            />
            <ScheduluePicker
              step={watch('length')}
              onClickTimeButton={onClickTimeButton}
              timeTableList={timeTableList}
              setTimeTableList={setTimeTableList}
              days={days}
              times={times}
            />

            <label className="input-group input-group-vertical">소개</label>
            <textarea
              className="w-full max-w-xs textarea textarea-bordered h-24"
              {...register('introduce')}
              placeholder="introduce"
            />
            <div>
              <button className="btn">등록</button>
              <button type="button" className="btn" onClick={moveRouter}>
                취소
              </button>
            </div>
          </form>
        </div>
      </ul>
    </div>
  );
};

export default CreateLessons;
