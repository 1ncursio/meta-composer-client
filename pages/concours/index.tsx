import React from 'react';
import ConcourList from '@react-components/Concours/concourList';
import Link from 'next/link';

const ConcoursPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-auto">concours page</h1>
      <Link href="/concours/register">
        <a className="place-self-center">
          <button className=" btn btn-primary">등록하기</button>
        </a>
      </Link>
      <ConcourList />
    </div>
  );
};
export default ConcoursPage;
