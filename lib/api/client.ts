import useStore from '@store/useStore';
import { getBackEndUrl } from '@utils/getEnv';
import axios from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import refreshAccessToken from './auth/refreshAccessToken';

export interface TokenPayload extends JwtPayload {
  userId: string;
  exp: number;
  iat: number;
}

const { CancelToken } = axios;
export const source = CancelToken.source();

const client = axios.create({
  withCredentials: true,
  cancelToken: source.token,
});

client.defaults.baseURL = getBackEndUrl();

export const refreshInterceptor = client.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      throw new Error('No headers found in config');
    }

    // @ts-ignore
    const accessToken: string | undefined = config.headers.common.authorization;

    if (!accessToken) {
      await refreshAccessToken();
      config.headers.authorization = useStore.getState().user.accessToken;
      return config;
    }

    const decoded = jwtDecode<TokenPayload>(accessToken);

    /* 액세스 토큰 만료 시간까지 1분 미만일 경우 리프레시 */
    if (decoded.exp * 1000 <= Date.now() + 60 * 1000) {
      await refreshAccessToken();
      config.headers.authorization = useStore.getState().user.accessToken;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default client;
