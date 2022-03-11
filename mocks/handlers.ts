import { IMessage } from '@typings/IMessage';
import { getBackEndUrl } from '@utils/getEnv';
import { rest } from 'msw';

const backendUrl = getBackEndUrl();
const messages: IMessage[] = [
  {
    id: 1,
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
    createdAt: new Date(),
    message: 'hey there, how are you?',
    chatRoom: {
      id: 1,
      lesson: {},
      messages: [],
      student: {} as any,
    },
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

    const newMessage = {
      id: 2,
      user: {
        id: 123,
        email: 'ckswn1323@g.yju.ac.kr',
        password: 'asd',
        provider: 'facebook',
        username: 'asd',
        profile_image: null,
        provider_id: 123,
        self_introduce: null,
      },
      createdAt: new Date(),
      message,
      chatRoom: {
        id: 1,
        lesson: {},
        messages: [],
        student: {} as any,
      },
    };

    messages.push(newMessage);

    return res(
      ctx.json({
        status: 200,
        message: 'OK',
        payload: newMessage,
      }),
    );
  }),
];
