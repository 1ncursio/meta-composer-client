import IConcours from './IConcours';
import IUser from './IUser';

export default interface IConcours_signup {
  id: number;
  concours: IConcours;
  user: IUser;
  youtubeURL: string;
  merchant_uid: string;
  participated_date: Date;
}
