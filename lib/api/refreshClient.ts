import axios from 'axios';

const refreshClient = axios.create({ withCredentials: true });

refreshClient.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? `${process.env.NEXT_PUBLIC_HOST}/api` : 'https://jungse.shop';

export default refreshClient;
