// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export const queryOwnResources = (userFieldName: string): Hook => {
  return async (context: HookContext) => {
    const isAdmin = context.params.user.role === 'Admin';
    if (!isAdmin && context.params.query) {
      context.params.query[userFieldName] = context.params.user._id;
    }
    return context;
  };
};
