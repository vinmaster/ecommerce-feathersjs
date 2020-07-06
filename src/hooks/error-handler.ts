// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { HookContext } from '@feathersjs/feathers';
import logger from './../logger';

export const errorLogger = async (context: HookContext) => {
  logger.error(context.error);
  if (context.error.stack) logger.error(context.error.stack);
  return context;
};
