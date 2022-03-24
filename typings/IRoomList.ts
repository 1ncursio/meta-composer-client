import IChatRoom from './IChatRoom';
import ILesson from './ILesson';
import { IMessage } from './IMessage';
import ITeacher from './ITeacher';

export interface ILessonChatRoom extends ILesson {
  chatRooms: IChatRoom[];
}

export interface IUserChatLesson extends ILesson {
  teacher: ITeacher;
}

export interface IUserChatList {
  id: number;
  userId: number;
  lessonId: number;
  created_at: Date;
  updated_at: Date;
  __messages__: IMessage[];
  __lesson__: ILesson;
}

export default interface IRoomList {
  /* 강사일때 학생들의 채팅 */
  LessonList: ILessonChatRoom[];
  /* 학생일때 레슨의 채팅 */
  userChatList: IUserChatList[];
}
