import pluralize from 'pluralize';
import { get, noop } from 'lodash';

const allQueries = [];

const addQuery = (query = () => '') => {
  allQueries.push(query);
  return (newQuery = () => '') => {
    allQueries.push(newQuery);
    return (key) => allQueries.map(query => `${query(key)} \n` ).join('');
  }
}

const addResolver = (target, key, descriptor) => {
  return async function() {
      try {
        const isAllow = get(target[key], 'allow', function() { return true; });
        if (isAllow.bind(target)(...arguments)) {
          return await descriptor.value.bind(target)(...arguments);
        }

        return null;
      } catch (error) {
        throw new Error('Decorators query failed. \n' + error);
      }
    };
}

const query = function(params) {
  return (target, key, descriptor) => {
    const defaultFields = 'id: String, skip: Int, limit: Int, sort: String';
    let newQuery = '';

    switch (typeof params) {
      case 'string':
      newQuery = (nameType) => `${key}(${params}): [${nameType}],`;
      break;
      case 'object':
      const fields = get(params, 'fields', defaultFields);
      newQuery = (nameType) => `${key}(${fields}): [${get(params, 'responseType', nameType)}],`;
      break;
      default:
      newQuery = (nameType) => `${key}(${defaultFields}): [${nameType}],`;
    }

    target.Query = addQuery(newQuery);
    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Query = Object.assign({}, target.Resolvers.Query);
    target.Resolvers.Query[key] = addResolver(target, key, descriptor);
  }
};

export default query;
