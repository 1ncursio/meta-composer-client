import React, { useEffect } from 'react';
import useStore from '../store';

const BearsPage = () => {
  const { bears, increasePopulation, removeAllBears } = useStore((state) => state);

  return (
    <div>
      <h1>{`곰은 ${bears}마리 입니다.`}</h1>
      <button onClick={increasePopulation} className="btn">
        증가
      </button>
      <button onClick={removeAllBears} className="btn">
        전부 제거
      </button>
    </div>
  );
};

export default BearsPage;
