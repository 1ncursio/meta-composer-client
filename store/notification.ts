import { IMessage } from '@typings/IMessage';
import produce from 'immer';
import { AppSlice, AppState } from './useStore';
import client from '@lib/api/client';
import IUser from '@typings/IUser';
import { ISignupForm, SumitDays } from '@pages/lessons/[lessonId]/signup';
import { getBackEndUrl } from '@utils/getEnv';
import ICurrentTarget from '@typings/IEvent';
import { NextRouter } from 'next/router';

export interface NotificationSlice {
  notification: {
    sendNoti: ({ msg, ws, router }: { msg: IMessage; ws: Window; router: NextRouter }) => Promise<void>;
  };
}

const createNotificationSliceSlice: AppSlice<NotificationSlice> = (set, get) => ({
  notification: {
    sendNoti: async ({ msg, ws, router }) => {
      if (!Notification) {
        return;
      }
      console.log(Notification.permission, '!!!!!!!!!!!');
      const permission = await Notification.requestPermission();
      if (permission === 'denied') return;
      const option = {
        requireInteraction: false,
        data: msg,
        body: msg.message,
        icon: '',
      };
      const el = new Notification(msg.sender.username, option);
      el.onclick = function (event) {
        if (event.currentTarget !== null) {
          const test: ICurrentTarget = event.currentTarget;
          // ws.location.href = `${ws.location.origin}/chats/${test.data?.chatRoomId}`;
          router.push(`/chats/${test.data?.chatRoomId}`);
        }
      };
    },
  },
});

export default createNotificationSliceSlice;
