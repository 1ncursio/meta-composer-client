import IUser from './IUser';

export default interface ITeacher {
  career: string;
  introduce: string;
  self_video: string;
  user: IUser;
  userId: number;
  // lessson: ILesson;
}
