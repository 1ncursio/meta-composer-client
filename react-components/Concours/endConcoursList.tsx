import axios from 'axios';
import React from 'react';
import useSWR from 'swr';
import client from '../../lib/api/client';
import fetcher from '@lib/api/fetcher';
import Concours from '@store/concours';
import { getSocketUrl } from '@utils/getEnv';
import optimizeImage from '@utils/optimizeImage';
import Image from 'next/image';
import Link from 'next/link';

const EndConcoursList = () => {
  const { data: concours } = useSWR<Concours[]>('/concours', fetcher);
  const today = new Date();
  return (
    <div className="relative">
      <div className="container grid grid-cols-4 grid-rows-2 grid-flow-rows h-full w-full gap-4">
        {concours &&
          concours
            .filter((item) => new Date(`${item.finishTime}`) < today)
            .map((item) => (
              <div key={item.id} className="card w-80 bg-base-100 shadow-xl">
                <figure>
                  <Image
                    src={optimizeImage(item?.coverIMG_url)}
                    alt="Cover Image"
                    className="rounded-xl"
                    width={200}
                    height={200}
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{item.title}</h2>
                  <p className="h-24 overflow-hidden">{item.contents}</p>
                  <div className="card-actions">
                    <Link href={`/concours/concoursResult?id=${item.id}`}>
                      <a>
                        <button className="btn btn-primary">수상작 보기</button>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default EndConcoursList;
