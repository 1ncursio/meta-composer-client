import IChatRoom from './IChatRoom';
import IUser from './IUser';

export interface IMessage {
  id: number;
  chatRoom: IChatRoom;
  senderId: number;
  message: string;
  createdAt: Date;
}
