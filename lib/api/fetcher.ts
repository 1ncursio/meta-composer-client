import { ServerResponse } from "../../typings/ServerResponse";
import client from "./client";

const fetcher = <Data>(url: string) =>
  client
    .request<Data>({ url, transformResponse: (r: ServerResponse) => r.data })
    .then((res) => res.data);

export default fetcher;
