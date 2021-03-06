import ITeacher from './ITeacher';

export default interface IUser {
  id: number;
  email: string;
  password: string | null;
  provider: string;
  username: string;
  profile_image: string | null;
  provider_id: number;
  self_introduce: string | null;
  teacher: ITeacher | null;
  is_admin: boolean;
}
