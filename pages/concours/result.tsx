import React from 'react';
import ConcoursResult from '@react-components/Concours/concoursResult';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';

import useSWR from 'swr';

const ConcourResultPage = () => {
  // client.get('/youtubes/top3view').then((res) => {
  //   console.log(res.data.payload[0].items[0]);
  // });

  const { data: top } = useSWR('/youtubes/top3view', fetcher);
  // console.log(top);

  return (
    <div>
      <h2>result</h2>
      <ConcoursResult result={top} />
    </div>
  );
};

export default ConcourResultPage;
