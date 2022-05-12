import IPayment from '@typings/IPayment';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FC, useCallback, useMemo, useState } from 'react';

export interface PaymentPropos {
  payment: IPayment;
  changePayment: (payment: IPayment, pay: number) => void;
}

const PaymentsComponent: FC<PaymentPropos> = ({ payment, changePayment }) => {
  const [num, setNum] = useState(false);

  const lessonCount = useMemo(() => {
    if (!payment) return 1;
    return payment.signup.howManyMonth * 4 * payment.signup.timetable.length;
  }, [payment]);

  const dayCalculation = useMemo(() => {
    if (!payment) return { finishedCount: 0 };
    let max = new Date();
    const current = new Date();
    let finishedCount = 0;
    payment.signup.signuptimetables.forEach((time) => {
      const signupTime = new Date(time.time);
      if (current > signupTime) finishedCount++;
      if (max < signupTime) max = signupTime;
    });
    return { lastDate: dayjs(max).format('YYYY-MM-DD'), finishedCount };
  }, [payment]);

  const chek = useCallback(() => {
    setNum((before) => !before);
  }, []);
  return (
    <div className="border flex flex-col w-full p-2 rounded-md ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={payment.signup.__lesson__.imageURL}
            alt="user profile"
            //   placeholder="blur"
            // layout="fill"
            width={64}
            height={64}
            className="mask mask-squircle"
          />
          <div className="flex flex-col">
            <p className="font-bold text-lg">{payment.signup.__lesson__.name} </p>
            <p className="font-bold text-lg">김정세</p>
          </div>
        </div>
        <div
          className={`border rounded-xl  ${
            payment.refund ? 'bg-gray-500' : 'bg-blue-500'
          } font-bold text-white p-1 pl-2 pr-2`}
        >
          {payment.refund ? '레슨종료' : '레슨중'}
        </div>
      </div>
      <div className="w-full flex flex-row-reverse">
        <div className="flex flex-col">
          <p className="font-bold">{payment.signup.startdate}| 수업시작</p>
          <p className="font-bold">{dayCalculation?.lastDate}| 수업종료</p>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse mt-2">
        <label className="btn btn-circle swap swap-rotate">
          <input type="checkbox" onClick={() => chek()} readOnly />

          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </div>
      <div className={num ? 'mt-2 border-t-2 w-full flex flex-col ' : 'hidden '}>
        <div className="flex justify-between ">
          <div className="flex">
            <p className="font-bold">레슨결제 ({lessonCount}회)</p>
          </div>
          <div className="flex items-end gap-2 ">
            <p className="font-bold">총 </p>
            <p className="font-bold text-xl">{lessonCount * payment.signup.__lesson__.price}원</p>
          </div>
        </div>
        <div className="flex  justify-between">
          <p className="font-bold">레슨진행 ({dayCalculation?.finishedCount}회)</p>
          <div className="flex items-end gap-2 ">
            <p className="font-bold"> 총</p>
            <p className="font-bold text-xl">{dayCalculation?.finishedCount * payment.signup.__lesson__.price}원</p>
          </div>
        </div>
        <div className="flex  flex-row-reverse items-end gap-2">
          <p className="font-bold text-xl text-red-500">
            {payment.signup.__lesson__.price * (lessonCount - dayCalculation.finishedCount)}원
          </p>
          <p className="font-bold  text-sm ">{payment.refund ? '한불한 금액' : '환불가능한 금액'}</p>
        </div>
        {!payment.refund && (
          <div className="flex  flex-row-reverse">
            <label
              onClick={() =>
                changePayment(payment, payment.signup.__lesson__.price * (lessonCount - dayCalculation.finishedCount))
              }
              htmlFor="my-modal-5"
              className="btn btn-error btn-sm bg-red-500"
            >
              환불하기
            </label>
            {/* <button className="btn btn-error btn-sm bg-red-500">환불하기</button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsComponent;
