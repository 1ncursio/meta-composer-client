import IUser from './IUser';

/* 알림 */
export interface INotification {
  id: number;
  readTime: Date | boolean | null;
  created_at: Date;
  updated_at: Date;
  userId: number;
  content: string;
  url: string;
  type: string;
}
interface Signup {
  id: number;
  lessonId: number;
  userId: number;
  startdate: Date;
  finishdate: Date;
  weekdays: string;
  lessonTime: Date;
  created_at: Date;
  updated_at: Date;
  __user__: IUser;
}
interface Comment {
  contents: string;
  id: number;
  lessonId: number;
  userId: number;
  rating: number;
  created_at: Date;
  updated_at: Date;
  user: IUser;
}
