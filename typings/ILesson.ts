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
}
export interface Comment {
  contents: string;
  created_at: Date;
  id: number;
  rating: number;
  user: IUser;
}
export interface TimeTables {
  IsEmpty: boolean;
  created_at: Date;
  day: string;
  id: number;
  lessonId: number;
  time: Date;
  updated_at: Date;
}
