import IPayment from '@typings/IPayment';
import Image from 'next/image';
import { FC } from 'react';

export interface PaymentModalPropos {
  payment: IPayment | undefined;
  pay: number | undefined;
}
const PaymentsModal: FC<PaymentModalPropos> = ({ payment, pay }) => {
  return (
    <div>
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      {payment && (
        <div className="modal ">
          <div className="modal-box w-3/5 max-w-2xl flex flex-col gap-2">
            <h3 className="font-bold text-lg text-center ">환불 요청</h3>

            <div className="flex p-2 items-end gap-2">
              <Image
                src={payment.signup.__lesson__.imageURL}
                alt="user profile"
                //   placeholder="blur"
                // layout="fill"
                width={64}
                height={64}
                className="mask mask-squircle"
              />
              <div className="flex flex-col ">
                <p className="font-bold text-lg">{payment.signup.__lesson__.name}</p>
                <p className="text-lg">{pay}원</p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="bg-gray-300 rounded p-2 text-center text-white">사유를 입력해주세요.</p>
              <textarea className="border-4" name="" id="" cols={30} rows={10}></textarea>
            </div>
            <div className="flex  justify-between gap-2">
              <div></div>
              <div className="modal-action">
                <label htmlFor="my-modal-5" className="btn btn-error btn bg-red-500">
                  즉시환불
                </label>
              </div>{' '}
              <div className="modal-action">
                <label htmlFor="my-modal-5" className="btn">
                  취소
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsModal;
