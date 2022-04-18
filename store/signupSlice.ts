import produce from 'immer';
import { AppSlice, AppState } from './useStore';
import client from '@lib/api/client';
import IUser from '@typings/IUser';
import { ISignupForm } from '@pages/lessons/[lessonId]/signup';

export interface SignSlice {
  signup: {
    signupLoad: ({ data, lessonId }: { data: ISignupForm; lessonId: number }) => Promise<void>;
  };
}

const createSignSlice: AppSlice<SignSlice> = (set, get) => ({
  signup: {
    signupLoad: async ({ data, lessonId }) => {
      const { IMP } = window;
      IMP?.init('imp85545116');

      const check = await client({
        method: 'post',
        url: `http://localhost:4000/api/signups/lessons/check/${lessonId}`,
      });

      if (check.data === '결제취소') return;

      const Lday = 'MON';
      const Lmonth = 1;
      const Ltime = '00:00:00';
      const Lstartdate = Date.now();

      event?.preventDefault();

      console.log(Lday, Lmonth, Ltime, Lstartdate);

      await IMP?.request_pay(
        {
          pg: 'html5_inicis',
          pay_method: 'card',
          merchant_uid: `ORD20180131-0000011`,
          name: '메타컴포저 수강신청' + Lmonth + '개월분',
          amount: 100 * Lmonth,
          buyer_email: data.buyer_email,
          buyer_name: data.buyer_name,
          buyer_tel: data.buyer_tel,
          buyer_postcode: '41416',
        },
        async function (rsp) {
          if (!rsp.success) return;
          const res = await client({
            method: 'post',
            url: `http://localhost:4000/api/signups/lessons/${lessonId}`,
            data: JSON.stringify({
              merchant_uid: rsp.merchant_uid,
              startdate: Lstartdate,
              howManyMonth: Lmonth,
              lessonTime: Ltime,
              weekdays: Lday,
            }),
          });
          const signupsId = res.data.id;
          if (!signupsId) return;
          const reRes = await client({
            method: 'post',
            url: 'http://localhost:4000/api/payments',
            data: JSON.stringify({
              merchant_uid: res.data.merchant_uid,
              card_name: rsp.vbank_name,
              signupId: signupsId,
              receipt_url: rsp.vbank_date,
            }),
          });
          if (reRes.status === 200 || 202) {
            console.log('결제 성공');
          }
        },
      );
    },
  },
});

export default createSignSlice;
