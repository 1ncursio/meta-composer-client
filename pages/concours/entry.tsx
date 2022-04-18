import React from 'react';
import useSWR from 'swr';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';
import { useRouter } from 'next/router';
import EntryConcours from '@react-components/Concours/entryConcours';

const Entry = () => {
  const router = useRouter();
  const { data: concours } = useSWR<Concours>(`/concours/${router.query.id}`, fetcher);

  return (
    <div>
      <h2>Entry Conours</h2>
      {concours ? <EntryConcours concours={concours}></EntryConcours> : null}
    </div>
  );
};

export default Entry;
