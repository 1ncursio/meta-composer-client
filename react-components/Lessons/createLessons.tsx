import { useSchedulePicker } from '@hooks/useSchedulePicker';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import ScheduluePicker from '@react-components/SchedulePicker';
import optimizeImage from '@utils/optimizeImage';
import dayjs from 'dayjs';
import produce from 'immer';
import Image from 'next/image';
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

  return (
    <div className="container mx-auto">
      <ul>
        <h1 className="pb-8">Create Lessons</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div>
              <label className="label">
                <span className="label-text">레슨 이름</span>
              </label>
              <input
                type="text"
                placeholder="레슨명을 입력해주세요."
                {...register('name')}
                autoComplete="off"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">커버 이미지</span>
              </label>
              <div>
                {thumbnailImageSrc && (
                  <Image alt="Cover Image" src={thumbnailImageSrc} width={640} height={360} objectFit="cover" />
                )}
                <div
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <input name="imgUpload" type="file" accept="image/*" onChange={saveFileImage} />
                  <button className="btn btn-sm btn-error" onClick={() => deleteFileImage()}>
                    삭제
                  </button>
                </div>

                {/* {thumbnailImageSrc ? (
                  <Image alt="Cover Image" src="https://via.placeholder.com/600x363" width={400} />
                ) : (
                  <Image alt="Cover Image" src={optimizeImage(thumbnailImageSrc)} width={400} />
                )} */}
              </div>
            </div>
            <div>
              <label className="label">
                <span className="label-text">난이도</span>
              </label>
              <select id="lessonType" {...register('difficulty')} className="input input-bordered w-full max-w-xs">
                <option value="beginner">입문자</option>
                <option value="intermediate">중급자</option>
                <option value="advanced">숙련자</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">이런 걸 배워요!</span>
              </label>
              <input
                type="text"
                placeholder="이런 걸 배워요!"
                {...register('weLearnThis')}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">확인 사항</span>
              </label>
              <input
                type="text"
                placeholder="확인 사항"
                {...register('checkPlease')}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <label className="label">
              <span className="label-text">가격</span>
            </label>
            <input
              type="number"
              placeholder="숫자만 입력하세요"
              {...register('price', {
                valueAsNumber: true,
              })}
              className="input input-bordered w-full max-w-xs"
            />
            <br />
            <label className="label">
              <span className="label-text">레슨 타입</span>
            </label>
            <select id="lessonType" {...register('type')} className="input input-sm input-bordered w-full max-w-xs">
              <option value="Sonata">소나타</option>
              <option value="Etudes">에튀드</option>
              <option value="Waltzes">왈츠</option>
              <option value="Nocturnes">녹턴</option>
              <option value="Marches">행진곡</option>
            </select>
            <br />
            <label className="label">
              <span className="label-text">레슨 진행 시간</span>
            </label>
            <input
              type="number"
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
            <label className="label">
              <span className="label-text">
                레슨 소개 <span className="text-error">(잠재 수강생들이 매력을 느낄만한 글을 짧게 남겨주세요.)</span>
              </span>
            </label>
            <textarea
              className="w-full max-w-xs textarea textarea-bordered h-24"
              {...register('introduce')}
              placeholder="ex) 이 강의를 통해 수강생은 피아노 연주의 기초를 다질 수 있을 것으로 예상합니다."
            />
            <div>
              <button className="btn btn-primary">레슨 등록</button>
            </div>
          </form>
        </div>
      </ul>
    </div>
  );
};

export default CreateLessons;
