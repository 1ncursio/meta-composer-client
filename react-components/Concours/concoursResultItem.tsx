import React from 'react';
import Image from 'next/image';

const ConcoursResultItem = (item: any) => {
  // console.log(item.item[0]);
  return (
    <div className="card w-96 bg-base-100 shadow-xl place-self-center">
      <div className="card-body text-center">
        {/* <span>{item.item[0].snippet.title}</span> */}
        <iframe src={`https://www.youtube.com/embed/${item.item[0].id}?autoplay=0&mute=1`}></iframe>
        <span>{item.item[0].snippet.title}</span>
        <span>{item.item[0].statistics.viewCount}</span>
      </div>
    </div>
  );
};

export default ConcoursResultItem;
