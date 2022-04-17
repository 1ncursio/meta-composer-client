import React from 'react';
import RegisterForm from '@react-components/Concours/registerForm';

const register = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="mx-auto">Register Conours</h1>
      <RegisterForm />
    </div>
  );
};

export default register;
