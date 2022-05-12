import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import DashboardContainer from '@react-components/DashboardContainer';
import LessonComponent from '@react-components/lessonComponents';
import IWishList from '@typings/IWishList';
import produce from 'immer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const WisilistIndexPage = () => {
  const {
    data: wishlist,
    mutate,
    setSize,
  } = useSWRInfinite<IWishList[]>((index) => `/wishlists?perPage=8&page=${index + 1}`, fetcher);
  const [isListHover, setIsListHover] = useState<number>(-1);
  useEffect(() => {
    if (wishlist) console.log(wishlist);
  }, [wishlist]);
  const [current, setCurrent] = useState<number>(1);
  const deleteWish = useCallback(
    async (id) => {
      mutate(
        produce((data) => {
          data[0] = data[0].filter((wi: IWishList) => {
            return wi.lesson.id !== id;
          });
        }),
        false,
      );
      await client.delete(`/wishlists/${id}`);
    },
    [mutate],
  );
  const onPage = useCallback(
    (page: number, current) => () => {
      if (current + page == 0) return;
      if (page > 0 && wishlist && wishlist[current - 1]?.length <= 6) {
        return;
      }
      setSize((prevSize) => {
        const current = prevSize + page;
        setCurrent(current);
        return current;
      });
    },
    [setSize, wishlist],
  );

  return (
    <DashboardContainer>
      <div className="container w-2/3 flex py-10 flex flex-col gap-2">
        <p className="text-lg font-bold text-center">My WishList</p>
        <div className="border-2 rounded p-2 grid grid-cols-4 grid-rows-2 grid-flow-rows h-full w-full  gap-y-8 ">
          {wishlist &&
            wishlist[current - 1]?.map((wish) => {
              return (
                <div key={wish.id} onMouseEnter={() => setIsListHover(wish.id)} onMouseLeave={() => setIsListHover(-1)}>
                  <LessonComponent
                    lesson={wish.lesson}
                    show={wish.id === isListHover}
                    wordCount={50}
                    deleteWish={deleteWish}
                  />
                </div>
              );
            })}
        </div>
        {wishlist && wishlist[0]?.length > 0 && (
          <div className="w-full flex ">
            <div className="btn-group  mx-auto">
              <button className="btn" onClick={onPage(-1, current)}>
                «
              </button>
              <button className="btn">{current}</button>
              <button className="btn" onClick={onPage(1, current)}>
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default WisilistIndexPage;
