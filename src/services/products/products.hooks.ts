import * as authentication from '@feathersjs/authentication';
import { required, discard, setNow, populate } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      required('name', 'price', 'qty'),
      setNow('createdAt', 'updatedAt'),
    ],
    update: [authenticate('jwt'), setNow('updatedAt')],
    patch: [authenticate('jwt'), setNow('updatedAt')],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      populate({
        schema: {
          include: {
            asArray: true,
            service: 'categories',
            nameAs: 'categories',
            parentField: 'category_ids',
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
