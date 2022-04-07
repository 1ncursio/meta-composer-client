import ILesson from './ILesson';
import IUser from './IUser';

/* 과제 */
export default interface IAssignment {
  id: number;
  startedTime: Date;
  endTime: Date;
  contents: string;
  title: string;
  isFinished: boolean;
  accuracy: number;
  time_length: string;
  finished_times: number;
  user: IUser;
  lesson: ILesson;
}
