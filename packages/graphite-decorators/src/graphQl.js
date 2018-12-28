import {
  get,
  noop,
} from 'lodash';

import { functionName } from '@graphite/utils';

const getObjectType = (nameClass = '', types = '') => `
  type ${nameClass} implements node {
    id: ID!,
    ${types}
  }
`;


const graphQl = function(target) {
  const nameClass = functionName(target);
  const graphQlDefault = { Types: '' }
  const graphql = get(target.prototype, 'graphQl', graphQlDefault);

  // const createTypes = target.prototype.createTypes;

  target.nameClass = nameClass;
  target.Types = getObjectType(nameClass, graphql.Types);
  target.Resolvers = Object.assign({}, target.Resolvers);
  target.isTestable = true;

  // if (target.hasOne) {
  //   const hasOne = {};
  //   hasOne[nameClass] = target.hasOne;
  //   Object.assign(target.Resolvers, hasOne);
  // }

  // if (target.hasMany) {
  //   const hasMany = {};
  //   hasMany[nameClass] = target.hasMany;
  //   Object.assign(target.Resolvers, hasMany);
  // }

  // if (target.create) {
  //   target.Types += target.create(nameClass, createTypes);
  // }

  // if (target.update) {
  //   target.Types += target.update(nameClass, createTypes);
  // }

  // if (target.responseTypeWithError) {
  //   target.Types += target.responseTypeWithError(nameClass);
  // }

  // // target.Types = `${get(target, 'Types', '')}`;
  // target.Mutation = get(target, 'Mutation', () => noop)()(nameClass);
  // target.Query = get(target, 'Query', () => noop)()(nameClass);
  // // console.log(" target.Types ", target.Types)

  // console.log("target.Types  ",target.Types )

  // return target
};

export default graphQl;
