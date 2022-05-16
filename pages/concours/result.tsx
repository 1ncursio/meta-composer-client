import React from 'react';
import ConcoursResult from '@react-components/Concours/concoursResult';
import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';

import useSWR from 'swr';

const ConcourResultPage = () => {
  client.get('youtubes/top3view').then((res) => {
    console.log(res);
  });
  return (
    <div>
      <h2>result</h2>
      <ConcoursResult />
    </div>
  );
};

export default ConcourResultPage;
