import fetcher from '@lib/api/fetcher';
import DashboardContainer from '@react-components/DashboardContainer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

const PaymentsIndexPage = () => {
  const { data, mutate } = useSWR('/payments', fetcher);
  const [num, setNum] = useState(false);
  useEffect(() => {
    console.log(data);
  }, [data]);
  const chek = useCallback(() => {
    setNum((before) => !before);
  }, []);
  return (
    <DashboardContainer>
      <div className="w-full h-full">
        <div className="w-full h-12 bg-gray-600 text-white font-bold text-xl flex items-center pl-10 mb-6">
          결제내역
        </div>
        <div className="w-4/5 lg:w-1/2 mx-auto flex flex-col  ">
          <div className="border flex flex-col w-full p-2 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1513269798455-b0c23c9e4d5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGlhbm98fHx8fHwxNjUxNTU2NzU3&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                  alt="user profile"
                  //   placeholder="blur"
                  // layout="fill"
                  width={64}
                  height={64}
                  className="mask mask-squircle"
                />
                <div className="flex flex-col">
                  <p className="font-bold text-lg">클래식 레슨 </p>
                  <p className="font-bold text-lg">김정세</p>
                </div>
              </div>
              <div onClick={() => chek()} className="border rounded-xl  bg-blue-500 font-bold text-white p-1 pl-2 pr-2">
                레슨중
              </div>
            </div>
            <div className="w-full flex flex-row-reverse">
              <div className="flex flex-col">
                <p className="font-bold">2022.12.02 | 수업시작</p>
                <p className="font-bold">2022.12.02 | 수업종료</p>
              </div>
            </div>
            <div className={num ? 'mt-2 border-t-2 w-full flex justify-between h-20' : 'hidden '}>
              <p className="font-bold"></p>ㅌ
            </div>
          </div>
        </div>{' '}
      </div>
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default PaymentsIndexPage;
