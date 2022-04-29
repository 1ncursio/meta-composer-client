import ITeacher from './ITeacher';
import IUser from './IUser';

/* 레슨 */
export default interface ILesson {
  id: number;
  imageURL: string;
  introduce: string;
  length: string;
  price: number;
  name: string;
  type: string;
  teacherId: number;
  __teacher__: ITeacher;
  comments: Comment[];
  timeTables: TimeTables[];
  rating: number;
}
export interface Comment {
  contents: string;
  created_at: Date;
  id: number;
  rating: number;
  user: IUser;
}
export interface TimeTables {
  created_at: Date;
  day: string;
  id: number;
  lessonId: number;
  time: Date;
  signupId: null | number;
  updated_at: Date;
}
