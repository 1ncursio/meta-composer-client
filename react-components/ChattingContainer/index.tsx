import DashboardSideBar from '@react-components/DashboardSideBar';
import React, { FC } from 'react';

export interface ChattingContainerProps {
  children: React.ReactNode;
}
// 여기 기본으로 룸 리스트 깔고 시작
const ChatContainer: FC<ChattingContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <DashboardSideBar />
      {children}
    </div>
  );
};

export default ChatContainer;
