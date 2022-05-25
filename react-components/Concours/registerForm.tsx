import React, { ChangeEvent, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import client from '@lib/api/client';

// const client = axios.create({
//   baseURL: 'http://localhost:4000',
//   withCredentials: true,
// });

const ConcoursRegisterForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<File | null>();
  const [people, setPeople] = useState('0');
  const [entryPee, setEntryPee] = useState('0');
  const peoples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const { handleSubmit } = useForm();

  const setURL = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = (data: any) => {
    const targetPage = '/concours';
    const formData = new FormData();
    formData.append('price', entryPee);
    formData.append('concoursSignupStartTime', '2023-05-17 14:00');
    formData.append('concoursSignupFinishTime', '2023-05-27 23:00');
    formData.append('startTime', startDate);
    formData.append('finishTime', endDate);
    formData.append('title', title);
    formData.append('contents', content);
    formData.append('minimum_starting_people', people);
    if (image) formData.append('image', image);

    console.log(formData);

    client
      .post('/concours', formData, { headers: { 'Content-Type': 'multipart/form' } })
      .then((res) => Router.push(targetPage));
  };

  return (
    <div className="mx-auto flex flex-col gap-28">
      <div className="border border-slate-300 rounded-lg px-96">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">대회명</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="콩쿠르 이름을 입력하세요"
                id="title"
                className="input input-bordered input-sm w-full max-w-xs"
              />
            </div>
          </div>
          <div>
            <label className="label">
              <span className="label-text">콩쿠르 설명</span>
            </label>
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
            <input type="date" id="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> ~{' '}
            <input type="date" id="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <label className="label">
              <span className="label-text">포스터 등록</span>
            </label>
            <input type="file" id="image" onChange={setURL} />
          </div>
          {/* concours.image */}
          <div>
            <label className="label">
              <span className="label-text">최소 인원수</span>
            </label>
            <select
              className="select select-bordered select-sm max-w-xs"
              name="people"
              id="people"
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
              className="text-right input input-bordered input-sm  max-w-xs"
              id="enternce_pee"
              type="text"
              min={0}
              value={entryPee}
              onChange={(e) => setEntryPee(e.target.value)}
            />
            원
          </div>

          <button type="submit" className="btn btn-primary place-self-center bg-amber-500 w-28 rounded-md text-white">
            등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConcoursRegisterForm;
