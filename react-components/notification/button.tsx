import useUserSWR from '@hooks/swr/useUserSWR';
import { NotificaitonSWR } from '@pages/notifications';
import { IMessage } from '@typings/IMessage';
import { INotification } from '@typings/INotification';
import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useMemo } from 'react';

export interface NotificaitonCountProps {
  count: number;
  setSize: (size: number | ((_size: number) => number)) => Promise<NotificaitonSWR[] | undefined>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

const NotificaitonButton: FC<NotificaitonCountProps> = ({ count, setSize, currentPage, setCurrentPage }) => {
  const pageCount = useMemo(
    function () {
      const arr = [];
      const page = parseInt(String(Math.ceil(count / 5)));
      for (let i = 0; i < page; i++) {
        arr.push(i + 1);
      }
      console.log(arr);
      return arr;
    },
    [count],
  );

  const onPage = useCallback(
    (page: number, pass: boolean) => () => {
      if (pass) {
        setSize(page);
        setCurrentPage(page - 1);
      } else {
        const check = currentPage + page;
        if (check >= pageCount.length || check < 0) return;
        setSize((prevSize) => prevSize + page).then(() => {});
        setCurrentPage((before) => before + page);
      }
    },
    [setSize, pageCount, currentPage],
  );

  return (
    <div className="max-w-2xl mx-auto">
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px">
          <li>
            <a
              onClick={onPage(-1, false)}
              href="#"
              className="bg-white-200 border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ml-0 rounded-l-lg leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              이전
            </a>
          </li>
          {pageCount.map((page) => (
            <li>
              <a
                // key={page}
                onClick={onPage(page, true)}
                className={`bg-${
                  currentPage === page - 1 ? 'red-200' : 'white-200'
                } border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-whit`}
              >
                {page}
              </a>
            </li>
          ))}

          <li>
            <a
              onClick={onPage(1, false)}
              href="#"
              className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-r-lg leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              다음
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NotificaitonButton;
