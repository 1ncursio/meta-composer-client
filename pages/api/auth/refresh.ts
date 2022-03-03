// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ServerData } from '@typings/ServerData';

export default function handler(req: NextApiRequest, res: NextApiResponse<ServerData>) {
  /* 
    테스트를 위한 더미 토큰. 
    실제로는 서버에서 생성한 토큰을 받아서 사용해야 함. 
    {
        "id": 1,
        "iat": 1642581055,
        "exp": 1650000000
    }
    */
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQyNTgxMDU1LCJleHAiOjE2NTAwMDAwMDB9.lluqZ3hWlXVXa7_RZKfFkeMLtd8tsTgksIX_3MBszv8';

  res.setHeader('Authorization', `Bearer ${accessToken}`);
  res.status(200).json({
    status: 200,
    message: 'OK',
    payload: true,
  });
}
