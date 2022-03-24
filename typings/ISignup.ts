import ILesson from './ILesson';
import IUser from './IUser';

export default interface ISignup {
  id: number;
  merchant_uid: string;
  lesson: ILesson;
  user: IUser;
  startdate: Date;
  finishdate: Date;
  weekdays: string;
  lessonTime: string;
}
