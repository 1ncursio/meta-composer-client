import React from 'react';
import RegisterForm from '@react-components/Concours/registerForm';

const RegisterConcoursPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl text-center">콩쿠르 등록</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterConcoursPage;
