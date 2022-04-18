import ITeacher from './ITeacher';

export default interface ILesson {
  id: number;
  introduce: string;
  length: string;
  price: number;
  name: string;
  type: string;
  teacher: ITeacher;
  difficulty: string;
  weLearnThis: string;
  checkPlease: string;
}
