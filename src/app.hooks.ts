// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { errorLogger } from './hooks/error-handler';
import { discard } from 'feathers-hooks-common';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [discard('_id')],
    update: [discard('_id')],
    patch: [discard('_id')],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [errorLogger],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
