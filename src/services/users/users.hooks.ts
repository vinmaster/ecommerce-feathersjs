import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import {
  setNow,
  preventChanges,
  required,
  disallow,
  discard,
  iff,
  isProvider,
  isNot,
  alterItems,
} from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import logger from '../../logger';
import { isAllowed } from '../../hooks/is-allowed';
import { unique } from '../../hooks/unique';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      required('username', 'password'),
      unique('username'),
      discard('_id'),
      hashPassword('password'),
      setNow('createdAt', 'updatedAt'),
    ],
    update: [
      iff(isProvider('external'), iff(isNot(isAllowed), disallow())),
      // Handle when password is null
      alterItems((rec) => {
        if (!rec.password) delete rec.password;
      }),
      hashPassword('password'),
      iff(isProvider('external'), discard('createdAt', 'updatedAt')),
      setNow('updatedAt'),
    ],
    patch: [
      iff(isProvider('external'), iff(isNot(isAllowed), disallow())),
      // Unique fields
      unique('username'),
      // Handle when password is null
      alterItems((rec) => {
        if (!rec.password) delete rec.password;
      }),
      hashPassword('password'),
      iff(isProvider('external'), discard('createdAt', 'updatedAt')),
      setNow('updatedAt'),
      // preventChanges(false, 'createdAt', 'updatedAt'),
    ],
    remove: [iff(isProvider('external'), iff(isNot(isAllowed), disallow()))],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
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
