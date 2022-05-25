import Concours from '@store/concours';
import React, { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import client from '@lib/api/client';
import Router from 'next/router';
import optimizeImage from '@utils/optimizeImage';
import Image from 'next/image';
import Link from 'next/link';

const ConcourUpdate = ({ concours }: { concours: Concours }) => {
  const [title, setTitle] = useState(concours.title);
  const [content, setContent] = useState(concours.contents);
  const [startDate, setStartDate] = useState(concours.startTime);
  const [endDate, setEndDate] = useState(concours.finishTime);
  const [image, setImage] = useState<File | null>();
  const [people, setPeople] = useState('0');
  const [entryPee, setEntryPee] = useState(`${concours.price}`);
  const peoples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const { handleSubmit } = useForm();

  //   const setURL = (e: ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files) {
  //       setImage(e.target.files[0]);
  //     }
  //   };

  const setUrl = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = (data: any) => {
    const targetPage = `/concours/details?id=${concours.id}`;
    const formData = new FormData();
    formData.append('price', entryPee);
    formData.append('concoursSignupStartTime', '2023-05-17 14:00');
    formData.append('concoursSignupFinishTime', '2023-05-27 23:00');
    formData.append('startTime', startDate);
    formData.append('finishTime', endDate);
    formData.append('title', title);
    formData.append('contents', content);
    if (image) formData.append('image', image);

    client.put(`/concours/${concours.id}`, formData).then((res) => Router.push(targetPage));
  };

  return (
    <div className="mx-auto flex flex-col gap-28">
      <h1 className="text-xl text-center">Change Concours Information</h1>
      <div className="border border-slate-300 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
          <div className="flex flex-col place-self-center">
            <Image
              className="place-self-center"
              src={optimizeImage(concours?.coverIMG_url)}
              alt="사진이 존재하지 않습니다."
              width={250}
              height={450}
            />
            <input type="file" id="image" onChange={setUrl} className="place-self-center" />
          </div>
          <div className="flex flex-col ">
            <div>
              <label className="label">
                <span className="label-text">대회명</span>
              </label>
              {/* concours.title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                className="input input-bordered input-sm w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">대회 설명</span>
              </label>
              {/* concours.title */}
              <textarea
                className="textarea textarea-bordered h-24"
                id="content"
                cols={30}
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">대회 기간</span>
              </label>
              {/* concours.date */}
              <input
                type="date"
                id="date"
                value={startDate.split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />{' '}
              ~{' '}
              <input type="date" id="date" value={endDate.split('T')[0]} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <label className="label">
                <span className="label-text">최소 인원수</span>
              </label>
              <select
                name="people"
                id="people"
                value={concours.minimum_starting_people}
                onChange={(e) => setPeople(e.target.value)}
              >
                {peoples.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                  // concours.people
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">참가비</span>
              </label>
              {/* concours.pee */}
              <input
                className="input input-bordered input-sm  max-w-xs text-right"
                id="enternce_pee"
                type="text"
                value={entryPee}
                onChange={(e) => setEntryPee(e.target.value)}
              />
              원
            </div>
            <div>
              <button type="submit" className="place-self-center bg-amber-500 w-28 rounded-md text-white m-5">
                수정하기
              </button>
              <button className="place-self-center bg-amber-500 w-28 rounded-md text-white m-5y">
                <Link href={`/concours/details?id=${concours.id}`}>
                  <a>취소</a>
                </Link>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConcourUpdate;
