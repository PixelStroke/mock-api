export interface IUserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  gender: string;
  createdOn: Date;
  isActive: boolean;
};
