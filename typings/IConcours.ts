export default interface IConcours {
  id: number;
  price: number;
  concoursSignupStartTime: Date;
  concoursSignupFinishTime: Date;
  startTime: Date;
  finishTime: Date;
  title: string;
  contents: string;
  coverIMG_url: string;
}
