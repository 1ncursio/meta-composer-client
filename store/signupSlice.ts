import produce from 'immer';
import { AppSlice, AppState } from './useStore';
import client from '@lib/api/client';
import IUser from '@typings/IUser';
import { ISignupForm, SumitDays } from '@pages/lessons/[lessonId]/signup';
import { getBackEndUrl } from '@utils/getEnv';
import { NextRouter } from 'next/router';

export interface SignSlice {
  signup: {
    signupLoad: ({
      data,
      lessonId,
      router,
    }: {
      data: ISignupForm;
      lessonId: number;
      router: NextRouter;
    }) => Promise<void>;
  };
}

const createSignSlice: AppSlice<SignSlice> = (set, get) => ({
  signup: {
    signupLoad: async ({ data, lessonId, router }) => {
      const { IMP } = window;
      IMP?.init('imp85545116');

      const check = await client({
        method: 'post',
        url: `${getBackEndUrl()}/signups/lessons/check/${lessonId}`,
      });

      if (check.data === '결제취소') return;

      const Lday = data.submitDays.map((m) => m.Lday);
      const Lmonth = data.Lmonth;
      const Ltime = data.submitDays.map((m) => m.Ltime);
      const Lstartdate = data.Lstartdate;
      //개월 이랑 /마지막날 정하기
      // event?.preventDefault();

      // await IMP?.request_pay(
      //   {
      //     pg: 'html5_inicis',
      //     pay_method: 'card',
      //     merchant_uid: `ORD20180131-${Math.random() * 1000000}`,
      //     name: '메타컴포저 수강신청' + Lmonth + '개월분',
      //     amount: data.PaymentAmount,
      //     buyer_email: data.buyer_email,
      //     buyer_name: data.buyer_name,
      //     buyer_tel: data.buyer_tel,
      //     buyer_postcode: '41416',
      //   },
      //   async (rsp) => {
      //     console.log(rsp);
      //     if (!rsp.success) return;
      const res = await client.post(`${getBackEndUrl()}/signups/lessons/${lessonId}`, {
        data: {
          merchant_uid: 'ORD20180131',
          startdate: Lstartdate,
          howManyMonth: Lmonth,
          lessonTime: Ltime,
          weekdays: Lday,
        },
      });
      const signupsId = res.data.id;
      console.log(res);
      if (!signupsId) {
        alert('수강을 할수 없습니다');
        return;
      }
      alert('결제가 완료 되었습니다');
      setTimeout(() => {
        router.push(`/lessons/${lessonId}`);
      }, 1000);

      // const reRes = await client({
      //   method: 'post',
      //   url: 'http://localhost:4000/api/payments',
      //   data: JSON.stringify({
      //     merchant_uid: res.data.merchant_uid,
      //     card_name: '11111',
      //     signupId: signupsId,
      //     receipt_url: 'Edfdfdf',
      //   }),
      // });
      // if (reRes.status === 200 || 202) {
      //   console.log('결제 성공');
      // }
      //   },
      // );
    },
  },
});

export default createSignSlice;
