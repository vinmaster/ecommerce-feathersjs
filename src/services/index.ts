import { Application } from '../declarations';
import users from './users/users.service';
import products from './products/products.service';
import categories from './categories/categories.service';
import orders from './orders/orders.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);
  app.configure(products);
  app.configure(categories);
  app.configure(orders);
}
