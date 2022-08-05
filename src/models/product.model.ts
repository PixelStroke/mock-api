import { ICompanyModel } from "./";

export interface IProductModel {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  inStock: boolean;
  company?: ICompanyModel;
  createdOn: Date;
  updatedOn: Date;
}