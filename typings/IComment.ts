import ILesson from './ILesson';
import IUser from './IUser';

export default interface IComment {
  id: number;
  contents: string;
  rating: number;
  lesson: ILesson;
  user: IUser;
}
