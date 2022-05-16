import React from 'react';

const ConcoursResultItem = (item: any) => {
  console.log(item.item[0]);
  const link = `https://www.youtube.com/watch?v=${item.item[0].id}`;
  return (
    <div>
      {item.item[0].snippet.title}-{item.item[0].statistics.viewCount}
      <a href={link}>link</a>
    </div>
  );
};

export default ConcoursResultItem;
