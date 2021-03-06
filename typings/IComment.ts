import ILesson from './ILesson';
import IUser from './IUser';

/* κ°μ λκΈ */
export default interface IComment {
  id: number;
  contents: string;
  rating: number;
  lesson: ILesson;
  user: IUser;
}
