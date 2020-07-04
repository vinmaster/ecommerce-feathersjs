// Initializes the `categories` service on path `/categories`
import { ServiceAddons } from '@feathersjs/feathers';
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
  service.create({ name: 'Other' });
}
