import { Mutex } from "async-mutex";
// import { AxiosError } from "axios";
import { source } from "../client";
import refreshClient from "../refreshClient";

const mutex = new Mutex();

let accessToken = "";

export default async function refreshAccessToken(): Promise<string> {
  try {
    /* 
      뮤텍스가 Lock 상태가 아니면(첫 번째 리퀘스트) 뮤텍스를 acquire 하고 Lock을 걺.
      두 번째 리퀘스트부터는 Lock 상태이므로 Lock이 끝날 때까지 runExclusive에서 대기.
    */
    if (!mutex.isLocked()) {
      await mutex.runExclusive(async () => {
        try {
          // await refreshClient.get("/test", {
          //   withCredentials: true,
          // });
          const { headers } = await refreshClient.get("/refresh", {
            withCredentials: true,
          });
          console.log(headers);
          accessToken = headers.authorization;
        } catch (error) {
          if ((error as any).response.status === 401) {
            /* cancel all the requests if status code 401 returned */
            accessToken = "";
            source.cancel();
          }
        }
      });
    } else {
      await mutex.runExclusive(() => true);
    }
  } catch (e) {
    console.error(e);
  }

  return accessToken;
}
