import React, { FC } from 'react';

export interface XRToolbarProps {
  onOpenSheet: () => void;
}

const XRToolbar: FC<XRToolbarProps> = ({ onOpenSheet }) => {
  return (
    <div className="flex-1 flex">
      <button onClick={onOpenSheet} className="btn">
        악보 검색
      </button>
    </div>
  );
};

export default XRToolbar;
