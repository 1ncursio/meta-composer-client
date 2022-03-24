import ISignup from './ISignup';

export default interface ISignupTimetable {
  id: number;
  time: Date;
  signup: ISignup;
}
