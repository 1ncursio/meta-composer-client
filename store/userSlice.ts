import produce from 'immer';
import { AppSlice } from './useStore';
import client from '../lib/api/client';

export interface UserSlice {
  user: {
    accessToken: string;
    setAccessToken: (accessToken?: string) => void;
  };
}

const createUserSlice: AppSlice<UserSlice> = (set, get) => ({
  user: {
    accessToken: '',
    setAccessToken: (accessToken) => {
      set(
        produce((state) => {
          state.user.accessToken = accessToken ?? '';
          client.defaults.headers.common.authorization = accessToken ?? '';
        }),
      );
    },
  },
});

export default createUserSlice;
