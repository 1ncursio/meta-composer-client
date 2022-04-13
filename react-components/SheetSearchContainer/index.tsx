import useSheetsSWR from '@hooks/swr/useSheetsSWR';
import React, { FC, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

export interface SheetSearchContainerProps {
  onCloseSheet: () => void;
}

const SheetSearchContainer: FC<SheetSearchContainerProps> = ({ onCloseSheet }) => {
  const { data: sheetsData, setPage } = useSheetsSWR();

  useEffect(() => {
    if (sheetsData) {
      console.log(sheetsData);
    }
  }, [sheetsData]);

  return (
    <div className="absolute z-10 top-1/2 left-1/2 bg-white -translate-x-1/2 -translate-y-1/2 flex flex-col w-full max-w-4xl">
      <div className="flex justify-end">
        <button onClick={onCloseSheet}>
          <IoMdClose size={24} />
        </button>
      </div>
      <div className="p-2">
        <form className="flex">
          <input
            name="q"
            autoComplete="off"
            className="flex-1 input bg-base-200 input-sm input-primary focus:outline-none"
          />
          <button type="submit" className="btn btn-primary btn-sm no-animation">
            검색
          </button>
        </form>
      </div>
    </div>
  );
};

export default SheetSearchContainer;
