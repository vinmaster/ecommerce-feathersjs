// Initializes the `categories` service on path `/categories`
import { ServiceAddons, Paginated } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Categories } from './categories.class';
import createModel from '../../models/categories.model';
import hooks from './categories.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    categories: Categories & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/categories', new Categories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('categories');

  service.hooks(hooks);

  // Seeding
  app
    .service('categories')
    .find({ query: { name: 'Other' } })
    .then((result) => {
      result = result as Paginated<any>;
      if (result.total === 0) {
        service.create({ name: 'Other' });
      }
    });
}
