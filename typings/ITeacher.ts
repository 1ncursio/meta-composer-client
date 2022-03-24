import ILesson from './ILesson';
import IUser from './IUser';

export default interface ITeacher {
  id: number;
  career: string;
  introduce: string;
  self_video: string;
  user: IUser;
  lessson: ILesson;
}
