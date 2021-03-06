import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Params, Paginated } from '@feathersjs/feathers';
import { Application } from '../../declarations';

export class Products extends Service {
  app: Application;

  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async create(data: any, params?: Params) {
    const result = (await this.app
      .service('categories')
      .find({ query: { name: 'Other' } })) as Paginated<any>;

    const { category_ids } = data;
    if (!category_ids) {
      const category_ids = result.total > 0 ? result.data[0]._id : undefined;
      data.category_ids = [category_ids];
    }
    return super.create(data, params);
  }
}
