/* 알림 */
export interface INotification {
  id: number;
  readTime: Date | boolean | null;
  signupId?: number; //학생이 레슨 수강했을때 강사한테 보내느거 임
  commnetId?: number;
  created_at: Date;
  updated_at: Date;
  userId: number;
}
