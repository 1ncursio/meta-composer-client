import produce from 'immer';
import { AppSlice, AppState } from './useStore';
import client from '@lib/api/client';
import IUser from '@typings/IUser';

export interface UserSlice {
  user: {
    userData?: IUser;
    accessToken: string;
    setUserData: (userData?: IUser) => void;
    getAccessToken: () => string;
    setAccessToken: (accessToken?: string) => void;
  };
}

const createUserSlice: AppSlice<UserSlice> = (set, get) => ({
  user: {
    userData: undefined,
    accessToken: '',
    setUserData: (userData) => {
      set(
        produce((state: AppState) => {
          state.user.userData = userData;
        }),
      );
    },
    getAccessToken: () => {
      return get().user.accessToken;
    },
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
