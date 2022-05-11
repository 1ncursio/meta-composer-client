import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import client from '@lib/api/client';

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

  const onSubmit = async (data: any) => {
    const files = [];

    files.push(video);
    files.push(image);

    const formData = new FormData();
    formData.append('videoTitle', title + '');
    formData.append('description', content + '');
    if (files[0] && files[1]) {
      formData.append('files', files[0]);
      formData.append('files', files[1]);
    }
    try {
      setLoading(true);
      client
        .post(`/youtubes?id=${Router.query.id}`, formData, { headers: { 'Content-Type': 'multipart/form' } })
        .then((res) => {});
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto flex flex-col gap-4">
      {loading ? (
        <progress className="progress progress-warning w-56" value="70" max="100"></progress>
      ) : (
        <div className="border-2 border-black">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="title">영상 제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="description">영상 설명</label>
              <textarea
                name=""
                id="description"
                cols={10}
                rows={3}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              ></textarea>
            </div>
            <div>
              <label htmlFor="image">영상 등록</label>
              <input type="file" id="video" onChange={setVID} />
            </div>
            <div>
              <label htmlFor="image">썸네일 등록</label>
              <input type="file" id="image" onChange={setIMG} />
            </div>
            <button type="submit" className="btn btn-primary place-self-center bg-amber-500 w-28 rounded-md text-white">
              등록
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
