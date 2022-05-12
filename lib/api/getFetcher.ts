import refreshClient from './refreshClient';
const getFetcher = <Data>(url: string) =>
  refreshClient.request<{ payload: Data }>({ url }).then((res) => res.data.payload);

export default getFetcher;
