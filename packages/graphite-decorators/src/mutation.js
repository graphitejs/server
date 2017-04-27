import { get } from 'lodash';

const mutation = function(params) {
  return function(target, key, descriptor) {
    if (params) {
      const fields = get(params, 'fields', undefined);
      const parseFields = fields ? `(${fields})` : '';
      target.Mutation = `${target.Mutation || ''} \n ${key} ${parseFields}: ${params.responseType},`;
    }
    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Mutation = Object.assign({}, target.Resolvers.Mutation);
    target.Resolvers.Mutation[key] = async function() {
      try {
        const isAllow = get(target[key], 'allow', function() { return true; });
        if (isAllow.bind(target)(...arguments)) {
          return await descriptor.value.bind(target)(...arguments);
        }

        return null;
      } catch (error) {
        throw new Error('Decorators mutation failed. \n' + error);
      }
    };
  };
};

export default mutation;
