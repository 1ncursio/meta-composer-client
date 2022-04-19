import axios from 'axios';
import React from 'react';
import useSWR from 'swr';
import client from '../../lib/api/client';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';

const ConcourComponent = () => {
  const { data: concours } = useSWR<Concours[]>('/concours', fetcher);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-40">
      {concours &&
        concours.map((item) => (
          <div key={item.id} className="card w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <img src={item.coverIMG_url} alt="Cover Image" className="rounded-xl" width={150} height={280} />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{item.title}</h2>
              <p>{item.contents}</p>
              <div className="card-actions">
                <a href={`/concours/details?id=${item.id}`}>
                  <button className="btn btn-primary">Show Details</button>
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConcourComponent;
