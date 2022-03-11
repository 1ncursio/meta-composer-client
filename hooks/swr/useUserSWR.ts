import fetcher from '@lib/api/fetcher';
import IUser from '@typings/IUser';
import useSWR, { SWRConfiguration } from 'swr';

export default function useUserSWR(options: SWRConfiguration = {}) {
  const response = useSWR<IUser>('/auth', fetcher, { ...options });

  return response;
}
