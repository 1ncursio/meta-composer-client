import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Concours from '@store/concours';
import client from '../../lib/api/client';
import Router from 'next/router';
import useUserSWR from '@hooks/swr/useUserSWR';
import Link from 'next/link';
import { getSocketUrl } from '@utils/getEnv';
import optimizeImage from '@utils/optimizeImage';
import Image from 'next/image';

declare const window: typeof globalThis & {
  IMP: any;
};

const ConcourItem = ({ concours }: { concours: Concours }) => {
  const targetPage = '/concours';
  const { data: userData } = useUserSWR();
  const [entried, setEntried] = useState('');

  const deleteConcours = () => {
    client.delete(`/concours/${concours.id}`).then((res) => Router.push(targetPage));
  };

  client.post(`/concours-signups/check/${concours.id}`).then((res) => {
    setEntried(res.data);
  });

  const requestPay2 = async () => {
    event?.preventDefault();
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
        // pg: 'html5_inicis',
        // //naverpay ''''''' pg사는 ,              https://docs.iamport.kr/implementation/payment 를 참조할것.

        // pay_method: 'card',
        // //결제수단 merchant_uid: "ORD20180131-0000011", 자동저장
        // merchant_uid: 'ORD20180131-0123411',
        // name: '메타컴포저 콩쿠르 참여',
        // amount: concours.price,
        // buyer_email: current_user.data?.email,
        // buyer_name: current_user.data?.id,
        // buyer_tel: '010-1234-1234',
        // buyer_addr: '캘리포니아 마운틴뷰',
        // buyer_postcode: '41416',
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: `ORD20180131-${Math.random() * 1000000}`,
        name: '메타컴포저 수강신청',
        amount: concours.price,
        buyer_email: userData?.email,
        buyer_name: userData?.id,
        buyer_tel: '',
        buyer_postcode: '41416',
      },
      async function (rsp: any) {
        // callback임
        console.log(rsp);
        if (await rsp.success) {
          //결제가 완료될시 반환되는 응답객체 rsp의 성공여부에 따라, callback함수에 작성.  http요청할것.

          // const lessonId2 = document
          //     .getElementById('lessonId2')
          //     .value;

          alert('결제성공');

          location.reload();

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
              console.log(response.data.merchant_uid + 'merchant_uid');
              client
                .post('/payments', {
                  merchant_uid: response.data.merchant_uid,
                  card_name: rsp.card_name,
                  concoursSignupId: concoursSignupId,
                  receipt_url: rsp.receipt_url,
                })
                .then((response) => {
                  console.log(response.data);
                  alert('신청이 완료되었습니다.');
                  location.reload();
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

  const participateConcours = () => {
    const formData = new FormData();
    formData.append('concoursId', `${concours.id}`);
    formData.append('userId', `${userData?.id}`);
    formData.append('youtubeURL', 'url');
    formData.append('merchant_uid', 'uid');
    formData.append('participated_date', `${new Date()}`);

    client.post(`/concours-signups/${concours.id}`, formData).then((res) => console.log('success'));
  };

  return (
    <div className="flex flex-col gap-20">
      <h1 className="text-xl text-center">콩쿠르 상세정보</h1>
      {concours ? (
        <div className="flex flex-col gap-8 border rounded-xl p-4">
          <h2 className="text-4xl place-self-center">{concours.title}</h2>
          <div className="flex gap-20 self-center">
            <figure className="place-self-center">
              <Image
                src={optimizeImage(concours?.coverIMG_url)}
                alt="Cover Image"
                width={400}
                objectFit="cover"
                height={500}
                className="rounded-xl"
              />
            </figure>
            <div className="flex flex-col w-96 gap-10 place-self-center">
              <div>
                <h2 className="text-xl">대회 기간</h2>
                <p>
                  {concours.startTime.split('T')[0]} ~ {concours.finishTime.split('T')[0]}
                </p>
              </div>
              <div>
                <h2 className="text-xl">대회 설명</h2>
                <p>{concours.contents}</p>
              </div>
              <div>
                <h2 className="text-xl">최소 참가 인원</h2> <p>{concours.minimum_starting_people}명</p>
              </div>
              <div>
                <h2 className="text-xl">참가비</h2> <p>{concours.price}원</p>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="card-actions justify-center">
              <button className="btn btn-primary">
                <Link href="/concours">
                  <a>목록으로</a>
                </Link>
              </button>
              {userData?.is_admin ? (
                <>
                  <button className="btn btn-primary">
                    <Link href={`/concours/update?id=${concours.id}`}>
                      <a>수정하기</a>
                    </Link>
                  </button>
                  <button className="btn btn-error" onClick={deleteConcours}>
                    삭제하기
                  </button>
                </>
              ) : entried === '' ? (
                <>
                  <button onClick={requestPay2} className="btn btn-primary">
                    신청하기
                  </button>
                </>
              ) : (
                <button className="btn btn-primary">
                  <Link href={`/concours/uploadVideo?id=${concours.id}`}>
                    <a>영상 등록하기</a>
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">콩쿠르 정보가 없습니다.</div>
      )}
    </div>
  );
};

export default ConcourItem;
