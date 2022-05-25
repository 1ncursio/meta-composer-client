import axios from 'axios';
import React from 'react';
import useSWR from 'swr';
import client from '../../lib/api/client';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';
import { getSocketUrl } from '@utils/getEnv';
import optimizeImage from '@utils/optimizeImage';
import Image from 'next/image';

const ConcourList = () => {
  const { data: concours } = useSWR<Concours[]>('/concours', fetcher);

  return (
    <div className="relative">
      <div className="container grid grid-cols-4 grid-rows-2 grid-flow-rows h-full w-full gap-20">
        {concours &&
          concours.map((item) => (
            // <div key={item.id} className="flex flex-col">
            //   <a href={`/concours/details?id=${item.id}`} className="place-self-center">
            //     <img src={item.coverIMG_url} alt="Not Found image" className="w-40 h-52 rounded-xl" />
            //   </a>
            //   <span className="place-self-center text-center">{item.title}</span>
            //   <span className="place-self-center">
            //     {item.startTime.split('T')[0]} ~ {item.finishTime.split('T')[0]}
            //   </span>
            // </div>
            <div key={item.id} className="card w-96 bg-base-100 shadow-xl">
              <figure>
                <Image
                  src={optimizeImage(item?.coverIMG_url)}
                  alt="Cover Image"
                  className="rounded-xl"
                  width={300}
                  height={380}
                />
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
    </div>
  );
};

export default ConcourList;
