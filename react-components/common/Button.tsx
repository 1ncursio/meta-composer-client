import React, { FC } from 'react';

export interface ButtonProps {
  /** 버튼 안의 내용 */
  children: React.ReactNode;
  /** 클릭했을 때 호출할 함수 */
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  /** 버튼의 생김새를 설정합니다. */
  theme: 'primary' | 'secondary' | 'tertiary';
  /** 버튼의 크기를 설정합니다 */
  size: 'small' | 'medium' | 'big';
  /** 버튼을 비활성화 시킵니다. */
  disabled?: boolean;
  /** 버튼의 너비를 임의로 설정합니다. */
  width?: string | number;
}

/** `Button` 컴포넌트는 어떠한 작업을 트리거 할 때 사용합니다.  */
const Button: FC<ButtonProps> = ({ children, onClick, theme = 'primary', size, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // className="bg-primary-default px-4 text-white inline-flex items-center justify-center h-8 font-bold rounded-md"
      className="btn w-64 rounded-full"
    >
      {children}
    </button>
  );
};

export default Button;
