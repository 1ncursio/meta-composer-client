import ILesson from './ILesson';
import IUser from './IUser';

export default interface IAssignment {
  id: number;
  startedTime: Date;
  endTime: Date;
  contents: string;
  title: string;
  isFinished: boolean;
  accuracy: number;
  time_length: Date;
  //??시간머임
  finished_times: number;
  user: IUser;
  lesson: ILesson;
}
