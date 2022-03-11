import DashboardSideBar from '@react-components/DashboardSideBar';
import React, { FC } from 'react';

export interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer: FC<DashboardContainerProps> = ({ children }) => {
  return (
    <div className="flex gap-8">
      <DashboardSideBar />
      {children}
    </div>
  );
};

export default DashboardContainer;
