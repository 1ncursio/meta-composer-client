import { IMessage } from './IMessage';
import IUser from './IUser';

export default interface IChatRoom {
  id: number;
  userId: number;
  lessonId: number;
  user: IUser;
  // lesson: ILesson;
  __messages__: IMessage[];
  created_at: Date;
  updated_at: Date;
}
