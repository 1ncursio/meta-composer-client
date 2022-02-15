// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerData } from "../../../typings/ServerData";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerData>
) {
  res.status(200).json({
    status: 200,
    message: "OK",
    payload: {
      id: "1",
      email: "test@test.com",
      username: "test",
      image: "https://via.placeholder.com/256",
      provider: "facebook",
      socialId: "123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });
}
