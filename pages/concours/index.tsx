import React from 'react';
import ConcourList from '@react-components/Concours/concourList';

import Link from 'next/link';
import useUserSWR from '@hooks/swr/useUserSWR';

const ConcoursPage = () => {
  const current_user = useUserSWR();
  const isAdmin = current_user.data?.is_admin;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-auto text-xl">개최 중인 콩쿠르</h1>
      {isAdmin ? (
        <>
          <Link href="/concours/register">
            <a className="place-self-center">
              <button className=" btn btn-primary">등록하기</button>
            </a>
          </Link>
        </>
      ) : null}

      <ConcourList />
    </div>
  );
};
export default ConcoursPage;
