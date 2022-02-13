import { useRouter } from "next/router";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";
import { ServerData } from "../../../typings/ServerData";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerData>
) {
  const router = useRouter();
  const { id } = router.query;
  res.status(200).json({
    status: 200,
    message: "OK",
    payload: {
      id: id,
      email: "test@test.com",
      username: `"User-"${id}`,
      image: "https://via.placeholder.com/256",
      provider: "facebook",
      socialId: "123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });
}
