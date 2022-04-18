import IConcours from './IConcours';
import IUser from './IUser';

/* 콩쿨 참가 신청 */
export default interface IConcoursSignup {
  id: number;
  concours: IConcours;
  user: IUser;
  youtubeURL: string;
  merchant_uid: string;
  participated_date: Date;
}
