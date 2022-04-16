import ITeacher from './ITeacher';

/* 레슨 */
export default interface ILesson {
  id: number;
  imageURL: string;
  introduce: string;
  length: string;
  price: number;
  name: string;
  type: string;
  teacherId: number;
  __teacher__: ITeacher;
}
