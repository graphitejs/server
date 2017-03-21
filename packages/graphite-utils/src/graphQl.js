import { defaultsDeep } from 'lodash';

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

export default {
  extendTypeGraphQl,
  registerGhraphQl,
};
