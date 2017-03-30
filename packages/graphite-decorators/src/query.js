import pluralize from 'pluralize';
import { get } from 'lodash';

const query = function(params) {
  return (target, key, descriptor) => {
    const singularKey = pluralize(key, 1);
    if (params) {
      target.Query = `${target.Query || ''} \n ${key}(${params}): [${singularKey[0].toUpperCase() + singularKey.slice(1)}],`;
    } else {
      target.Query = `${target.Query || ''} \n ${key}: [${singularKey[0].toUpperCase() + singularKey.slice(1)}],`;
    }

    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Query = Object.assign({}, target.Resolvers.Query);
    target.Resolvers.Query[key] = async function() {
      try {
        const isAllow = get(target[key], 'allow', function() { return true });
        if (isAllow.bind(target)(...arguments)) {
          return await descriptor.value.bind(target)(...arguments);
        }

        return await descriptor.value.bind(target)(...arguments);
      } catch (error) {
        throw new Error('Decorators query failed. \n' + error);
      }
    };
  };
};

export default query;
