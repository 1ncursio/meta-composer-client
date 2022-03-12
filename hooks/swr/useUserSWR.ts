import fetcher from '@lib/api/fetcher';
import useStore from '@store/useStore';
import IUser from '@typings/IUser';
import useSWR, { SWRConfiguration } from 'swr';

export default function useUserSWR(options: SWRConfiguration = {}) {
  const { setUserData } = useStore((state) => state.user);
  const response = useSWR<IUser>('/auth', fetcher, { ...options });

  if (response.data) setUserData(response.data);

  return response;
}
