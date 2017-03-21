import pluralize from 'pluralize';

const query = function() {
  return (target, key, descriptor) => {
    const singularKey = pluralize(key, 1);
    target.Query = `${target.Query || ''} \n ${key}: [${singularKey[0].toUpperCase() + singularKey.slice(1)}],`;

    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Query = Object.assign({}, target.Resolvers.Query);
    target.Resolvers.Query[key] = async function() {
      try {
        return await descriptor.value.bind(target)(...arguments);
      } catch (error) {
        throw new Error('Decorators query failed. \n' + error);
      }
    };
  };
};

export default query;
