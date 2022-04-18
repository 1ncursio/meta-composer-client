import useUserSWR from '@hooks/swr/useUserSWR';
import client from '@lib/api/client';
import Concours from '@store/concours';
import React, { ChangeEvent, useState } from 'react';
import Head from 'next/head';

declare const window: typeof globalThis & {
  IMP: any;
};

const EntryConours = ({ concours }: { concours: Concours }) => {
  const [files, setFiles] = useState<FileList | null>();
  const [title, setTitle] = useState();
  const [exp, setExp] = useState();
  const current_user = useUserSWR();
  const youtubeURL = '';

  const setContents = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFiles(files);
    console.log(files);
  };

  const setUrl = () => {
    const formData = new FormData();

    client.post('/youtubes').then((res) => console.log({ res }));
  };

  const participateConcours = () => {
    const formData = new FormData();
    formData.append('concoursId', `${concours}`);
    formData.append('userId', `${current_user.data}`);
    formData.append('youtubeURL', 'url');
    formData.append('merchant_uid', 'uid');
    formData.append('participated_date', `${new Date()}`);

    client.post(`/concours-signups/${concours.id}`, formData).then((res) => console.log('success'));
  };

  const requestPay2 = async () => {
    const { IMP } = window;
    IMP.init('imp85545116');
    const params = new URLSearchParams(document.location.search);
    const URLconcoursId = params.get('id');
    console.log(URLconcoursId);
    let finishss;

    client.post(`/concours-signups/check/${URLconcoursId}`).then((res) => {
      if (res.data == '결제취소') {
        console.log('이미 등록한 콩쿠르입니다.');
        alert('이미 등록한 콩쿠르입니다.');
        window.location.href = `/concours?id=${URLconcoursId}`;
        //결제 불가능하니 홈이던지 결제페이지 이전으로던지 다시 돌리세요.

        console.log(res);
        console.log('으아아아아아악');

        finishss = false;

        return finishss;
      }
    });

    // IMP.request_pay(param, callback) 가 , 결제창 호출 메서드
    await IMP.request_pay(
      {
        // param
        pg: 'html5_inicis',
        //naverpay ''''''' pg사는 ,              https://docs.iamport.kr/implementation/payment 를 참조할것.

        pay_method: 'card',
        //결제수단 merchant_uid: "ORD20180131-0000011", 자동저장

        name: '메타컴포저 콩쿠르 참여',
        amount: concours.price,
        buyer_email: current_user.data?.email,
        buyer_name: current_user.data?.id,
        buyer_tel: '010-1234-1234',
        buyer_addr: '캘리포니아 마운틴뷰',
        buyer_postcode: '41416',
      },
      async function (rsp: any) {
        // callback임

        if (await rsp.success) {
          //결제가 완료될시 반환되는 응답객체 rsp의 성공여부에 따라, callback함수에 작성.  http요청할것.

          // const lessonId2 = document
          //     .getElementById('lessonId2')
          //     .value;

          alert('결제성공');

          // 성공 이후의 결제정보 전달은 ,             https://docs.iamport.kr/implementation/payment 확인할것.

          console.log(rsp + 'zzzzzzzzzzzzzzz');
          console.log(rsp.merchant_uid);

          let today = new Date();

          let year = today.getFullYear();
          let month = today.getMonth() + 1;
          let date = today.getDate();
          let day = today.getDay();
          let hours = today.getHours();
          let minutes = today.getMinutes();
          let seconds = today.getSeconds();

          //수강 등록하는 api api/concours-signups

          client
            .post(`/concours-signups/${URLconcoursId}`, {
              youtubeURL: '',
              concoursId: URLconcoursId,
              merchant_uid: rsp.merchant_uid,
              participated_date: year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds,
              // // "2022-03-09 14:00:00"
            })
            .then((response) => {
              console.log(JSON.stringify(response.data) + '콩쿠르 등록 성공했다');
              const concoursSignupId = response.data.id;
              console.log(response.data.id + '<<<- concoursSignupId ');
              client
                .post('/payments', {
                  merchant_uid: response.data.merchant_uid,
                  card_name: rsp.card_name,
                  concoursSignupId: concoursSignupId,
                  receipt_url: rsp.receipt_url,
                })
                .then((response) => {
                  console.log(response.data);
                })
                .catch((error) => {
                  console.log('등록 취소되었습니다.');
                });
            })
            .catch((error) => {
              console.log('등록 취소되었습니다.');
            });
        }
      },
    );
  };

  return (
    <div>
      <h2>entry Form</h2>
      <div>{concours.title}</div>
      <div>{concours.price}</div>
      <button onClick={requestPay2} className="btn btn-primary">
        test
      </button>
    </div>
  );
};

export default EntryConours;
