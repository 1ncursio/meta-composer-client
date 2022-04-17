import ILesson from './ILesson';
import { IMessage } from './IMessage';
import IUser from './IUser';

export default interface IUserChatRoom {
  id: number;
  userId: number;
  lessonId: number;
  user: IUser;
  __lesson__: ILesson;
  __messages__: IMessage[];
  created_at: Date;
  updated_at: Date;
  unReadCount: number;
}
