import IConcoursSignup from './IConcoursSignup';
import ISignup from './ISignup';
import IUser from './IUser';

/* 결제 */
export default interface IPayment {
  id: number;
  user: IUser;
  signup: ISignup;
  concours_Signup: IConcoursSignup;
  payment_number: string;
  affiliation: string;
  refund: string;
}
