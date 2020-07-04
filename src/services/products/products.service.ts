// Initializes the `products` service on path `/products`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Products } from './products.class';
import createModel from '../../models/products.model';
import hooks from './products.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'products': Products & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/products', new Products(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('products');

  service.hooks(hooks);
}
