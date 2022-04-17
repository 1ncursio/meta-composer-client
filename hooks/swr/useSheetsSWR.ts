import fetcher from '@lib/api/fetcher';
import ISheet from '@typings/ISheet';
import { useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

export default function useSheetsSWR(options: SWRConfiguration = {}) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const response = useSWR<ISheet[]>(`/sheets?perPage=${perPage}&page=${page}`, fetcher, { ...options });

  return { ...response, setPage };
}
