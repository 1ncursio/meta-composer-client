export default interface IUser {
  id: string;
  email: string;
  username: string;
  image: string | null;
  //   shortBio: string | null;
  provider: "google" | "facebook";
  socialId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
