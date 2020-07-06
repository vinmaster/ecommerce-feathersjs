// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Paginated } from '@feathersjs/feathers';
import { Conflict } from '@feathersjs/errors';

export const unique = (fields: string | string[]): Hook => {
  return async (context: HookContext) => {
    if (typeof fields === 'string' || fields instanceof String) {
      fields = [fields as string] as string[];
    }
    for (const field of fields) {
      const query = {} as any;
      query[field] = context.data[field];
      const result = (await context.service.find({
        query,
      })) as Paginated<any>;
      if (result.total > 0) {
        throw new Conflict(`${field} of ${context.data[field]} already exists`);
      }
    }

    return context;
  };
};
