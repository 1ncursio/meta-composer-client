import IConcours_signup from './IConcours_signup';
import ISignup from './ISignup';
import IUser from './IUser';

export default interface IPayment {
  id: number;
  user: IUser;
  signup: ISignup;
  concours_Signup: IConcours_signup;
  payment_number: string;
  affiliation: string;
  refund: boolean;
  receipt_url: string;
}
