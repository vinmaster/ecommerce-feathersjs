import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Params, Paginated } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import app from '../../app';
import logger from '../../logger';

export enum PaymentStatus {
  NotPaid = 'Not Paid',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

export enum FulfillmentStatus {
  New = 'New',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Returned = 'Returned',
}

export class Orders extends Service {
  app: Application;

  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async create(data: any, params?: Params) {
    // Customer Id should set to user id if not admin
    if (params?.user && params?.user?.role !== 'Admin') {
      data.customer_id = params?.user?._id;
    }
    data.payment_status = PaymentStatus.NotPaid;
    data.fulfillment_status = FulfillmentStatus.New;

    await this.removeQtyFromProducts(data.product_ids);

    return super.create(data, params);
  }

  async patch(id: any, data: any, params?: Params) {
    const oldIds = (await this.get(id)).product_ids;
    const newIds = data.product_ids;

    const { added, removed } = this.arrayDiff(oldIds, newIds);
    console.log('patch', added, removed);

    await this.removeQtyFromProducts(added);
    await this.addQtyToProducts(removed);

    return super.patch(id, data, params);
  }

  arrayDiff(oldIds: string[], newIds: string[]) {
    // Prevent mutations
    oldIds = [...oldIds];

    const added = [...newIds];
    const removed: string[] = [];

    for (const id of oldIds) {
      const index = added.indexOf(id);
      if (index !== -1) added.splice(index, 1);
      else removed.push(id);
    }

    return {
      added,
      removed,
    };
  }

  countOccurrences(arr: string[]) {
    return arr.reduce((acc, current) => {
      if (acc[current] === undefined) acc[current] = 0;
      acc[current] += 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  async removeQtyFromProducts(product_ids: string[]) {
    if (product_ids.length === 0) return;

    const product_ids_map = this.countOccurrences(product_ids);

    for (const id of Object.keys(product_ids_map)) {
      const product = await app.service('products').get(id);
      const orderQty = product_ids_map[id];
      const qty = product.qty - orderQty;
      await app.service('products').patch(id, { qty });
    }
  }

  async addQtyToProducts(product_ids: string[]) {
    if (product_ids.length === 0) return;

    const product_ids_map = this.countOccurrences(product_ids);

    for (const id of Object.keys(product_ids_map)) {
      const product = await app.service('products').get(id);
      const orderQty = product_ids_map[id];
      const qty = product.qty + orderQty;
      await app.service('products').patch(id, { qty });
    }
  }
}
