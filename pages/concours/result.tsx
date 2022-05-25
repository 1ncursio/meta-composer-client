import React from 'react';
import ConcoursResult from '@pages/concours/concoursResult';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';
import useSWR from 'swr';
import EndConcoursList from '@react-components/Concours/endConcoursList';

const ConcourResultPage = () => {
  // client.get('/youtubes/top3view').then((res) => {
  //   console.log(res.data.payload[0].items[0]);
  // });

  // client.get('/youtubes/playlist3topview/22').then((res) => {
  //   console.log(res);
  // });

  const { data: concours } = useSWR<Concours[]>('/concours', fetcher);

  // console.log(top);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl text-center">Concours Result</h2>
      {/* <ConcoursResult result={top} /> */}
      <EndConcoursList />
    </div>
  );
};

export default ConcourResultPage;
