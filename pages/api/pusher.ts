// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { ServerData } from "./../../typings/ServerData";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerData>
) {
  console.log(req.body);
  const pusher = new Pusher({
    appId: "1344600",
    key: "eef5f3bc1c485b22d058",
    secret: "9cb18f8a95b11d1b72de",
    cluster: "ap3",
    useTLS: true,
  });

  pusher.trigger("chat", "event", { data: req.body });
  res.status(200);
}
