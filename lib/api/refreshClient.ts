import { getBackEndUrl } from '@utils/getEnv';
import axios from 'axios';

const refreshClient = axios.create({ withCredentials: true });

refreshClient.defaults.baseURL = getBackEndUrl();

export default refreshClient;
