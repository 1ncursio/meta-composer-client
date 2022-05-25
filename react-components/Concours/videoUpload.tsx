import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import client from '@lib/api/client';
import Loading from './Loading';

// const client = axios.create({
//   baseURL: 'http://localhost:4000',
//   withCredentials: true,
// });

const VideoUpload = () => {
  const [image, setImage] = useState<File | null>();
  const [video, setVideo] = useState<File | null>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const targetPage = `/concours/details?id=${router.query.id}`;

  const { handleSubmit } = useForm();

  const setIMG = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const setVID = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

  const onSubmit = (data: any) => {
    const files = [];

    setLoading(true);

    try {
      files.push(video);
      files.push(image);

      const formData = new FormData();
      formData.append('videoTitle', title + '');
      formData.append('description', content + '');
      if (files[0] && files[1]) {
        formData.append('files', files[0]);
        formData.append('files', files[1]);
      }
      client
        .post(`/youtubes?id=${Router.query.id}`, formData, { headers: { 'Content-Type': 'multipart/form' } })
        .then((res) => {
          setLoading(false);
          alert('영상 등록 성공');
          Router.push(targetPage);
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="mx-auto flex flex-col gap-28">
      <h1 className="text-xl text-center">Video Upload</h1>
      <div className="border border-slate-300 rounded-lg px-96">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="label">
              <span className="label-text">영상 제목</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">영상 설명</span>
            </label>
            <textarea
              name=""
              id="description"
              cols={40}
              rows={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className="textarea textarea-bordered h-24"
            ></textarea>
          </div>
          <div>
            <label className="label">
              <span className="label-text">영상 등록</span>
            </label>
            <input type="file" id="video" onChange={setVID} />
          </div>
          <div>
            <label className="label">
              <span className="label-text">썸네일 등록</span>
            </label>
            <input type="file" id="image" onChange={setIMG} />
          </div>
          <button type="submit" className="btn btn-primary place-self-center bg-amber-500 w-28 rounded-md text-white">
            등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
