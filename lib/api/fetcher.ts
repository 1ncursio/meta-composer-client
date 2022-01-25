import client from "./client";

const fetcher = <Data>(url: string) =>
  client.request<{ payload: Data }>({ url }).then((res) => res.data.payload);

export default fetcher;
