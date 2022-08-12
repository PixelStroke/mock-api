import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { IUserModel, ITaskModel, ICompanyModel, IProductModel } from '../models/index';
import * as util from './utility';
dotenv.config();

type Data = {
  users?: IUserModel[];
  tasks?: ITaskModel[];
  companies?: ICompanyModel[];
  products?: IProductModel[];
};

export default class JsonDatabase {
  private data: Data = {};

  private SECRET_KEY = process.env.SECRET || '12345678';

  private expiresIn = '1h';

  constructor() {
    this.init();
  }

  private init(): void {
    util.log.info('Initializing databases');
    this.generateTasks();
    this.generateUsers(1, 300);
    this.generateCompanies(1, 25);
    this.generateProducts(1, 500);
    this.generateAuthenticatedUser();
  }

  private generateTasks(min: number = 1, max: number = 50): void {
    util.log.info('Generating tasks database');
    try {
      const tasks: ITaskModel[] = [];

      for (let id = min; id <= max; id += 1) {
        tasks.push({
          id,
          title: util.firstLetterToUpperCase(faker.git.commitMessage()),
          completed: faker.datatype.boolean(),
        });
      }

      this.data.tasks = tasks;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private generateUsers(min: number = 1, max: number = 50): void {
    util.log.info('Generating users database');
    try {
      const users: IUserModel[] = [];

      for (let id = min; id <= max; id += 1) {
        users.push({
          id,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          gender: faker.name.gender(),
          createdOn: faker.date.recent(365),
          isActive: faker.datatype.boolean(),
          username: `${faker.random.word()}${faker.random.word()}${faker.datatype.number({
            min: 1,
            max: 999,
          })}`,
        });
      }

      this.data.users = users;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private generateAuthenticatedUser(): void {
    util.log.info('Generating 1 authenticated user');
    try {
      if (this.data?.users) {
        this.data.users?.push({
          id: this.data.users.length + 1,
          firstName: 'sonic',
          lastName: 'hedgehog',
          email: 'sonic.hedgehog@sega.com',
          gender: 'hedgehog',
          createdOn: faker.date.recent(365),
          isActive: true,
          username: 'shedgehog',
          password: 'master_emerald0x0',
        });
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private generateCompanies(min: number = 1, max: number = 50): void {
    util.log.info('Generating companies database');
    try {
      const companies: ICompanyModel[] = [];

      for (let id = min; id <= max; id += 1) {
        companies.push({
          id,
          name: faker.company.companyName(),
        });
      }

      this.data.companies = companies;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private generateProducts(min: number = 1, max: number = 50): void {
    util.log.info('Generating products database');
    try {
      const products: IProductModel[] = [];

      for (let id = min; id <= max; id += 1) {
        const product: IProductModel = {
          id,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          quantity: faker.datatype.number({ min: 1, max: 999 }),
          inStock: faker.datatype.boolean(),
          createdOn: faker.date.recent(365),
          updatedOn: faker.date.recent(60),
        };

        if (this.data?.companies) {
          product.company =
            this.data.companies[
              faker.datatype.number({
                min: 1,
                max: this.data.companies.length - 1,
              })
            ];

          products.push(product);
        }
      }

      this.data.products = products;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public printDatabase(): void {
    try {
      const database = JSON.stringify(this.data);
      util.log.info(database);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public createDatabaseFile = async (file: string): Promise<string> => {
    const database = JSON.stringify(this.data);

    return new Promise((resolve, reject) => {
      fs.writeFile(file, database, (err: any) => {
        if (err) reject(err);

        util.log.info(`Database file ${file} created`, 'success');
        resolve(file);
      });
    });
  };

  public createToken(payload: { email: string; password: string }) {
    util.log.info(`Creating token for user ${payload.email}`);
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.expiresIn });
  }

  public verifyToken(token: string) {
    util.log.info(`Verifying token ${token}`);
    return jwt.verify(token, this.SECRET_KEY, (err: any, decoded: any) => (decoded != null ? decoded : err));
  }

  public isAuthenticated(payload: { email: string; password: string }): boolean {
    util.log.info(`Checking if user ${payload.email} is authenticated`);
    if (this.data?.users) {
      const { email, password } = payload;
      return this.data.users.findIndex((user) => user.email === email && user.password === password) !== -1;
    }

    return false;
  }
}
