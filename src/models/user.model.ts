export interface IUserModel {
  id: number;
  age: number;
  companyId?: number;
  jobPosition?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  gender: string;
  createdOn: Date;
  isActive: boolean;
}
