import fs from 'fs';
import { faker }  from '@faker-js/faker';
import {
  IUserModel,
  ITaskModel,
  ICompanyModel,
  IProductModel } from '../models/index';

type Data = {
  users?: IUserModel[];
  tasks?: ITaskModel[];
  companies?: ICompanyModel[];
  products?: IProductModel[];
};

export class JsonDatabase {
  private _data: Data = {};

  constructor() {
    this._init();
  }

  private _init(): void {
    this._generateTasks();
    this._generateUsers(1, 300);
    this._generateCompanies(1, 25);
    this._generateProducts(1, 500);
  }

  private _generateTasks(min: number = 1, max: number = 50): void {
    try {
      const tasks: ITaskModel[] = [];

      for (let id = min; id <= max; id++) {
        tasks.push({
          id,
          title: this._firstLetterToUpperCase(faker.git.commitMessage()),
          completed: faker.datatype.boolean(),
        });
      }
  
      this._data.tasks = tasks;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private _generateUsers(min: number = 1, max: number = 50): void {
    try {
      const users: IUserModel[] = [];

      for (let id = min; id <= max; id++) {
        users.push({
          id,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          gender: faker.name.gender(),
          createdOn: faker.date.recent(365),
          isActive: faker.datatype.boolean(),
          username: `${faker.random.word()}${faker.random.word()}${faker.datatype.number({min: 1, max: 999})}`
        });
      }
  
      this._data.users = users;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private _generateCompanies(min: number = 1, max: number = 50): void {
    try {
      const companies: ICompanyModel[] = [];

      for (let id = min; id <= max; id++) {
        companies.push({
          id,
          name: faker.company.companyName(),
      });
      }
  
      this._data.companies = companies;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private _generateProducts(min: number = 1, max: number = 50): void {
    try {
      const products: IProductModel[] = [];

      for (let id = min; id <= max; id++) {
        const product: IProductModel = {
          id,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          quantity: faker.datatype.number({min: 1, max: 999}),
          inStock: faker.datatype.boolean(),
          createdOn: faker.date.recent(365),
          updatedOn: faker.date.recent(60),
        };
  
        if (!!this._data?.companies)
          product.company = this._data.companies[faker.datatype.number({min: 1, max: this._data.companies.length - 1})],
    
          products.push(product);
      }

      this._data.products = products;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private _firstLetterToUpperCase = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  public printDatabase(): void {
    try {
      const database = JSON.stringify(this._data);

      console.log(database);
    } catch(err: any) {
      throw new Error(err);
    }
  }

  public createDatabaseFile = async (file: string): Promise<string> => {
    const database = JSON.stringify(this._data);
    
    return new Promise((resolve, reject) => {

      fs.writeFile(file, database, (err: any) => {
        if (err) reject(err);
          
        resolve(file);
      });
    });
  }
}