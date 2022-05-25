import React from 'react';
import useSWR from 'swr';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';
import { useRouter } from 'next/router';
import EntryConcours from '@react-components/Concours/entryConcours';
import Script from 'next/script';

const Entry = () => {
  const router = useRouter();
  const { data: concours } = useSWR<Concours>(`/concours/${router.query.id}`, fetcher);

  return (
    <>
      <Script src="https://code.jquery.com/jquery-1.12.4.min.js" />
      <Script src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js" />
      <h2 className="text-2xl text-center">Entry Conours</h2>
      {concours ? <EntryConcours concours={concours}></EntryConcours> : null}
    </>
  );
};

export default Entry;
