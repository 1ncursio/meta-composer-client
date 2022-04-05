import useUserSWR from '@hooks/swr/useUserSWR';
import DashboardContainer from '@react-components/DashboardContainer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React, { useEffect } from 'react';

const MyProfileIndexPage = () => {
  const { data: userData } = useUserSWR();
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <DashboardContainer>
      {/* <div className="bg-white block py-10"> */}
      <div
        className=" max-w-2xl mx-auto gap-y-4  w-full border-solid border-2 border-gray-300
      flex flex-col items-center"
      >
        <Image src="/logo-with-name.svg" alt="Vercel Logo" width={400} height={330} />

        <div className="w-3/4 flex-col gap-y-4  content-start ">
          <p className="mb-3 font-semibold">username</p>
          <input
            type="search"
            className="focus:border-yellow-500 w-full px-4 py-1 bg-slate-100 text-gray-800  focus:outline-none border-solid  border-2 border-gray-300"
            placeholder="search"
            x-model="search"
          />
        </div>
        <div className="w-3/4 flex-col gap-y-4  content-start ">
          <p className="mb-3 font-semibold">username</p>
          <input
            type="search"
            className="focus:border-yellow-500 w-full px-4 py-1 bg-slate-100 text-gray-800  focus:outline-none border-solid  border-2 border-gray-300"
            placeholder="search"
            x-model="search"
          />
        </div>
      </div>
      {/* </div> */}
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default MyProfileIndexPage;
