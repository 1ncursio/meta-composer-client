import IChatRoom from './IChatRoom';
import IUser from './IUser';

export interface IMessage {
  id: number;
  chatRoom: IChatRoom;
  user: IUser;
  message: string;
  createdAt: Date;
}
