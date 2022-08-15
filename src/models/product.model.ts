export interface IProductModel {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  inStock: boolean;
  companyId?: number;
  createdOn: Date;
  updatedOn: Date;
}
