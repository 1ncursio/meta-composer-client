import { IMessage } from '@typings/IMessage';
/* 레슨 */
// export default interface IEvent extends Event {
//   currentTarget: ICurrentTarget;
// }
export default interface ICurrentTarget extends EventTarget {
  data?: IMessage;
}
