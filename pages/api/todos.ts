// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ServerData } from '../../typings/ServerData';

export default function handler(req: NextApiRequest, res: NextApiResponse<ServerData>) {
  res.status(200).json({
    status: 200,
    message: 'OK',
    payload: [
      {
        id: 1,
        content: '할 일 1',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        content: '할 일 2',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 3,
        content: '할 일 3',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ],
  });
}
