import ILesson from './ILesson';

export default interface IWishList {
  id: number;
  day: string;
  time: Date;
  //시간머임??
  lesson: ILesson;
}
