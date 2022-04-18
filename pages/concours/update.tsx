import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Concours from '@store/concours';
import ConcourUpdate from '@react-components/Concours/concourUpdate';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';

// interface Concours {
//   id: number;
//   price: number;
//   concoursSignupStartTime: string;
//   concoursSignupFinishTime: string;
//   startTime: string;
//   finishTime: string;
//   title: string;
//   contents: string;
//   coverIMG_url: string;
//   created_at: string;
//   updated_at: string;
// }

// const client = axios.create({
//   baseURL: 'http://localhost:4000',
//   withCredentials: true,
// });

const ConcoursUpdatePage = () => {
  const router = useRouter();

  const { data: concours } = useSWR<Concours>(`/concours/${router.query.id}`, fetcher);

  return <div>{concours ? <ConcourUpdate concours={concours} /> : <span>정보가 없습니다</span>}</div>;
};

export default ConcoursUpdatePage;
