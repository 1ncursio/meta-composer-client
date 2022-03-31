import React, { FC } from 'react';

export interface SheetSearchContainerProps {
  onCloseSheet: () => void;
}

const SheetSearchContainer: FC<SheetSearchContainerProps> = ({ onCloseSheet }) => {
  return (
    <div className="absolute -z-50 top-0 left-0">
      <button onClick={onCloseSheet}>삭제 테스트</button>
    </div>
  );
};

export default SheetSearchContainer;
