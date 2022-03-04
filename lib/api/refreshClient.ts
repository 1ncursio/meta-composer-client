import getEnv from '@utils/getEnv';
import axios from 'axios';

const refreshClient = axios.create({ withCredentials: true });

refreshClient.defaults.baseURL = getEnv('BACKEND_URL');

export default refreshClient;
