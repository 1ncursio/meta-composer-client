import ILesson from './ILesson';
import ISignupTimetable from './ISignupTimetable';
import IUser from './IUser';

export default interface ISignup {
  id: number;
  howManyMonth: number;
  __lesson__: ILesson;
  created_at: Date;
  signuptimetables: ISignupTimetable[];
  startdate: Date;
}
