import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import client from '../../lib/api/client';
import ConcourItem from '@react-components/Concours/concourItem';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';

const Details = () => {
  const router = useRouter();
  const { data: concours } = useSWR<Concours>(`/concours/${router.query.id}`, fetcher);

  return <div>{concours ? <ConcourItem concours={concours} /> : null}</div>;
};

export default Details;
