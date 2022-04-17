import React from 'react';
import ConcourList from '@react-components/Concours/concourList';
import Button from '@react-components/Button';

const concours = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-auto">concours page</h1>
      <a href="/concours/register" className="place-self-center">
        <button className=" btn btn-primary">등록하기</button>
      </a>
      <ConcourList />
    </div>
  );
};
export default concours;
