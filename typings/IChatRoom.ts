import ILesson from './ILesson';
import { IMessage } from './IMessage';
import IUser from './IUser';

export default interface IChatRoom {
  id: number;
  student: IUser;
  lesson: ILesson;
  messages: IMessage[];
}
