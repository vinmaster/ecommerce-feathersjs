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
} from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import logger from '../../logger';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;
const allowed = (context: HookContext) => {
  logger.info('------- is admin', context.params.user.roles);
  const user = context.params.user;
  const isAdmin = user.roles === 'Admin';
  const ownsResource = context.params?.query?.id === user._id;
  return isAdmin || ownsResource;
};

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      required('username', 'password'),
      hashPassword('password'),
      setNow('createdAt', 'updatedAt'),
    ],
    update: [
      // disallow(),
      hashPassword('password'),
      authenticate('jwt'),
      iff(isProvider('external'), iff(isNot(allowed), disallow())),
      iff(isProvider('external'), discard('createdAt', 'updatedAt')),
      setNow('updatedAt'),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      iff(isProvider('external'), discard('createdAt', 'updatedAt')),
      // preventChanges(false, 'createdAt', 'updatedAt'),
      setNow('updatedAt'),
    ],
    remove: [authenticate('jwt')],
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
