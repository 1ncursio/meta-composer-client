import ILesson from './ILesson';
import IUser from './IUser';

/* 강의 댓글 */
export default interface IComment {
  id: number;
  contents: string;
  rating: number;
  lesson: ILesson;
  user: IUser;
}
