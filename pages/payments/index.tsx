import fetcher from '@lib/api/fetcher';
import DashboardContainer from '@react-components/DashboardContainer';
import PaymentsComponent from '@react-components/Payments';
import PaymentsModal from '@react-components/Payments/paymentsModal';
import IPayment from '@typings/IPayment';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

const PaymentsIndexPage = () => {
  const { data: payData, mutate } = useSWR<IPayment[]>('/payments', fetcher);
  const [refund, setRefund] = useState<IPayment>();
  const [pay, setPay] = useState<number>();
  useEffect(() => {
    console.log({ payData });
  }, [payData]);
  const changePayment = useCallback(
    (payment: IPayment, pay: number) => {
      setPay(pay);
      setRefund(payment);
    },
    [setRefund, setPay],
  );
  return (
    <DashboardContainer>
      <PaymentsModal payment={refund} pay={pay} />
      <div className="w-4/5 h-full">
        <div className="w-full h-12 bg-gray-600 text-white font-bold text-xl flex items-center pl-10 mb-6">
          결제내역
        </div>
        <div className="w-4/5 lg:w-1/2 mx-auto flex flex-col  ">
          {payData &&
            payData.map((pay) => {
              return <PaymentsComponent key={pay.id} payment={pay} changePayment={changePayment} />;
            })}
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
