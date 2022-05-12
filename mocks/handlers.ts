// @ts-nocheck

import { IMessage } from '@typings/IMessage';
import { getBackEndUrl } from '@utils/getEnv';
import { rest } from 'msw';

const backendUrl = getBackEndUrl();
const user = {
  id: 1,
  email: 'ckswn1323@g.yju.ac.kr',
  password: null,
  provider: 'facebook',
  username: 'Yechan Kim',
  profile_image: 'https://lh3.googleusercontent.com/a-/AOh14Gi3OfZuPYz90d4F6WcPGiKLxDrkhp9GBwAOddBP=s96-c',
  provider_id: 123,
  self_introduce: null,
};
const messages: IMessage[] = [
  {
    id: 1,
    // @ts-ignore
    user: {
      id: 123,
      email: 'asd@naver.com',
      password: 'asd',
      provider: 'facebook',
      username: 'asd',
      profile_image: null,
      provider_id: 123,
      self_introduce: null,
    },
    message: 'hey there, how are you?',
    createdAt: new Date(),
  },
];

export const handlers = [
  rest.get(`${backendUrl}/chats`, (req, res, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'OK',
        payload: messages,
      }),
    );
  }),

  rest.post<{ message: string }>(`${backendUrl}/chats`, (req, res, ctx) => {
    const { body } = req;
    const { message } = body;

    if (!user)
      return res(
        ctx.json({
          status: 401,
          message: 'Unauthorized',
        }),
      );

    const newMessage = {
      id: messages.length + 1,
      message,
      user,
      createdAt: new Date(),
    };

    // @ts-ignore
    messages.unshift(newMessage);

    return res(
      ctx.json({
        status: 200,
        message: 'OK',
        payload: newMessage,
      }),
    );
  }),
];
