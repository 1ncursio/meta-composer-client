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

client.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? `${process.env.NEXT_PUBLIC_HOST}/api` : 'http://jungse.shop';

export const refreshInterceptor = client.interceptors.request.use(
  async (config) => {
    // @ts-ignore
    const accessToken = config.headers.common.authorization;

    if (!accessToken) {
      const authorization = await refreshAccessToken();
      // @ts-ignore
      config.headers.authorization = authorization;
      client.defaults.headers.common.authorization = authorization;
      return config;
    }

    const decoded = jwtDecode<TokenPayload>(accessToken);

    /* 액세스 토큰 만료 시간까지 1분 미만일 경우 리프레시 */
    if (decoded.exp * 1000 <= Date.now() + 60 * 1000) {
      const authorization = await refreshAccessToken();
      // @ts-ignore
      config.headers.authorization = authorization;
      client.defaults.headers.common.authorization = authorization;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default client;
