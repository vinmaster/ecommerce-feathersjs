import * as authentication from '@feathersjs/authentication';
import {
  required,
  setNow,
  populate,
  iff,
  isProvider,
  isNot,
  alterItems,
} from 'feathers-hooks-common';
import { queryOwnResources } from '../../hooks/query-own-resources';
import { isAllowed } from '../../hooks/is-allowed';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [queryOwnResources('customer_id')],
    get: [],
    create: [required('product_ids'), setNow('createdAt', 'updatedAt')],
    update: [setNow('updatedAt')],
    patch: [
      // Prevent customer from changing customer_id
      iff(
        isProvider('external'),
        iff(
          isNot(isAllowed),
          alterItems((rec) => {
            if (rec.customer_id) delete rec.customer_id;
          })
        )
      ),
      setNow('updatedAt'),
    ],
    remove: [],
  },

  after: {
    all: [
      populate({
        schema: {
          include: {
            service: 'users',
            nameAs: 'customer',
            parentField: 'customer_id',
            childField: '_id',
          },
        },
      }),
      populate({
        schema: {
          include: {
            asArray: true,
            service: 'products',
            nameAs: 'products',
            parentField: 'product_ids',
            childField: '_id',
          },
        },
      }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
