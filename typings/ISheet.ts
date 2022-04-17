import IUser from './IUser';

export default interface ISheet {
  id: number;
  userId: number;
  user: IUser;
  sheetName: string;
  isOpen: boolean;
  storedURL: string;
}
