/* 알림 */
export interface INotification {
  id: number;
  readTime: Date | boolean | null;
  signupId?: number;
  //제거 여부 불확실
  created_at: Date;
  updated_at: Date;
  userId: number;
}
