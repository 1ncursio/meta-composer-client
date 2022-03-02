// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ServerData } from '@typings/ServerData';

export default function handler(req: NextApiRequest, res: NextApiResponse<ServerData>) {
  // extract the token from the request header
  const token = req.headers.authorization;

  // if the token is not present, return a 401
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      payload: false,
    });
  }

  // if the token is present, return a 200
  res.status(200).json({
    status: 200,
    message: 'OK',
    payload: {
      id: 1,
      email: 'test@test.com',
      username: 'test',
      image: 'https://via.placeholder.com/256',
      provider: 'facebook',
      socialId: '123456789',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });
}
