import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application } from '../../declarations';
import { Params, Paginated } from '@feathersjs/feathers';
import { BadRequest, Forbidden } from '@feathersjs/errors';
import logger from '../../logger';
import app from '../../app';

export enum Role {
  Admin = 'Admin',
  Customer = 'Customer',
}

interface UserData {
  _id?: string;
  username: string;
  email?: string;
  password: string;
  role?: Role;
}

export class Users extends Service {
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: UserData, params?: Params) {
    // Provider from server, provider will be undefined
    // const fromExternal = params?.provider;
    // if (fromExternal && !params?.user) {
    //   throw new Forbidden('Not allowed');
    // }

    const { username, role } = data;
    if (!role) {
      data.role = Role.Customer;
    }
    // const result = (await this.find({ query: { username } })) as Paginated<any>;
    // // logger.info('------- user create', result.data);
    // if (result.total > 0) {
    //   // const error = {
    //   //   message: 'Invalid username',
    //   //   errors: {
    //   //     username: 'Invalid username',
    //   //   },
    //   // } as any;
    //   // throw new BadRequest(error);
    //   throw new BadRequest('Username exists');
    // }
    return super.create(data, params);
  }
}
