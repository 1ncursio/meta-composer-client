import IChatRoom from './IChatRoom';
import { IMessage } from './IMessage';
import IUser from './IUser';

export default interface ITeacherChatRoom {
  id: number;
  introduce: string;
  price: number;
  length: any;
  teacherId: number;
  type: string;
  chatRooms: IChatRoom[] | undefined;
  created_at: Date;
  updated_at: Date;
  name: string;
}
