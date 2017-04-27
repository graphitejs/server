import { defaultsDeep, get, isEmpty, pick, isArray, isEqual, lowerFirst } from 'lodash';

const registerGhraphQl = function(collections = []) {
  const defReduce = {
    Types: '',
    Query: '',
    Mutation: '',
    Resolvers: {},
  };

  const reduceCollections = collections.reduce((acum, collection) => {
    return  {
      Types: `${acum.Types} ${collection.Types}`,
      Query: `${acum.Query} ${collection.Query}`,
      Mutation: `${acum.Mutation} ${collection.Mutation}`,
      Resolvers: defaultsDeep(acum.Resolvers, collection.Resolvers),
    };
  }, defReduce);

  return reduceCollections;
};

const extendTypeGraphQl = function(target, extendType = ':', resolvers) {
  const nameType = extendType.split(':');
  const resolver = {};
  resolver[nameType[0]] = resolvers;
  target.Types = target.Types.replace('}', `${nameType[0]}: ${nameType[1]}, }`);
  if (!target.Resolvers.Account) {
    target.Resolvers.Account = {};
  }
  Object.assign(target.Resolvers.Account, resolver);
};

const createResponseType = function(target, nameClass) {
  const responseTypes = {};
  responseTypes[`response${nameClass}`] = {};
  responseTypes[`response${nameClass}`][nameClass.toLowerCase()] = function(model = {}) {
    return isEmpty(pick(model, Object.keys(get(target, 'schema', {})))) ? null : model;
  };
  responseTypes[`response${nameClass}`].errors = function(errors) {
    const requiredKeys = ['key', 'message'];
    if (isArray(errors) && isEqual(keys(errors[0]), requiredKeys)) {
      return errors;
    }
    return null;
  };
  Object.assign(target.Resolvers, responseTypes);

  target.Types += `
  type response${nameClass} {
    ${lowerFirst(nameClass)}: ${nameClass},
    errors: [Errors],
  }
  `;
};

const createInputType = function(target, nameClass, action) {
  target.Types += `
    input ${action}${nameClass} {
      ${target.createTypes}
    }
  `;
};

const addMutationToSchema = function(target, nameClass, action) {
  target.Mutation = `${get(target, 'Mutation', '')}
                     ${target[action](nameClass)}`;
};

export default {
  extendTypeGraphQl,
  registerGhraphQl,
  createResponseType,
  createInputType,
  addMutationToSchema,
};
