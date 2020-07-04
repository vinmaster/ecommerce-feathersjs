import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Params, Paginated } from '@feathersjs/feathers';
import { Application } from '../../declarations';

export enum PaymentStatus {
  NotPaid = 'NotPaid',
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
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: any, params?: Params) {
    data.payment_status = PaymentStatus.NotPaid;
    data.fulfillment_status = FulfillmentStatus.New;
    return super.create(data, params);
  }
}
