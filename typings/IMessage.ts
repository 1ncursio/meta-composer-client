import IUser from './IUser';

/* 메시지 */
export interface IMessage {
  id: number;
  // chatRoom: IChatRoom;
  image: string;
  senderId: number;
  sender: IUser;
  chatRoomId: number;
  message: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}
