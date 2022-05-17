import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Concours from '@store/concours';
import client from '../../lib/api/client';
import Router from 'next/router';
import useUserSWR from '@hooks/swr/useUserSWR';
import Link from 'next/link';
import { getSocketUrl } from '@utils/getEnv';

const ConcourItem = ({ concours }: { concours: Concours }) => {
  const targetPage = '/concours';
  const current_user = useUserSWR();
  console.log(current_user);
  const [entried, setEntried] = useState(false);

  const deleteConcours = () => {
    client.delete(`/concours/${concours.id}`).then((res) => Router.push(targetPage));
  };

  const participateConcours = () => {
    const formData = new FormData();
    formData.append('concoursId', `${concours.id}`);
    formData.append('userId', `${current_user.data?.id}`);
    formData.append('youtubeURL', 'url');
    formData.append('merchant_uid', 'uid');
    formData.append('participated_date', `${new Date()}`);

    client.post(`/concours-signups/${concours.id}`, formData).then((res) => console.log('success'));
  };

  return (
    <div className="flex flex-col gap-52">
      <h1 className="mx-auto">Concours Details</h1>
      {concours ? (
        <div className="flex">
          <div className="card card-side bg-base-100 w-full ">
            <figure>
              <img src={getSocketUrl() + '/' + concours?.coverIMG_url} alt="Movie" width={150} height={250} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{concours.title}</h2>
              <ul className="m-0 mb-30">
                <li>
                  대회 기간 {concours.startTime} ~ {concours.finishTime}
                </li>
                <li>대회 설명 {concours.contents}</li>
                <li>참가 인원 {concours.minimum_starting_people}</li>
                <li>참가비 {concours.price}</li>
              </ul>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">
                  <a href={`/concours/uploadVideo?id=${concours.id}`}>영상 등록하기</a>
                </button>
                <button className="btn btn-primary">
                  <a href={`/concours/entry?id=${concours.id}`}>신청하기</a>
                </button>

                <button className="btn btn-primary" onClick={deleteConcours}>
                  삭제하기
                </button>
                <button className="btn btn-primary">
                  <a href={`/concours/update?id=${concours.id}`}>수정하기</a>
                </button>
                <button className="btn btn-primary">
                  <Link href="/concours">
                    <a>목록으로</a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">콩쿠르 정보가 없습니다.</div>
      )}
    </div>
  );
};

export default ConcourItem;
