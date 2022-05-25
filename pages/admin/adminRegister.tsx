import client from '@lib/api/client';
import Router from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const AdminRegister = () => {
  const [allow, setAllow] = useState('');
  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // const formData = new FormData();
    // formData.append('pass', allow);
    // console.log(allow);
    client.post('/admin/register', { pass: allow }).then((res) => {
      console.log(res);
      Router.push('/');
    });
  };
  return (
    <div>
      관리자 등록
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" onChange={(e) => setAllow(e.target.value)} />
        <button className="btn btn-primary place-self-center bg-amber-500 w-28 rounded-md text-white">승인</button>
      </form>
    </div>
  );
};

export default AdminRegister;
