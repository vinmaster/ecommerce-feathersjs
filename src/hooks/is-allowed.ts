// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { HookContext } from '@feathersjs/feathers';

export const isAllowed = (context: HookContext) => {
  const user = context.params.user;
  const isAdmin = user.role === 'Admin';
  // Non users resource see if there's user_id field
  if (context.path !== 'users' && !context.params?.data?.user_id) {
    return isAdmin;
  }
  const ownsResource = context.params?.data?._id === user._id;
  return isAdmin || ownsResource;
};
