import IUser from './IUser';

/* 알림 */
export interface INotification {
  id: number;
  readTime: Date | boolean | null;
  signupId?: number; //학생이 레슨 수강했을때 강사한테 보내느거 임
  signup: Signup;
  commentId?: number;
  comment: Comment;
  created_at: Date;
  updated_at: Date;
  userId: number;
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
