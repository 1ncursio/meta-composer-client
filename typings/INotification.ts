import IUser from './IUser';

export interface INotification {
  id: number;
  type: string;
  readTime: Date;
  notifiable: string;
  //제거 여부 불확실
  data: string;
  user: IUser;
}
