/* 메시지 */
export interface IMessage {
  id: number;
  // chatRoom: IChatRoom;
  senderId: number;
  chatRoomId: number;
  message: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}
