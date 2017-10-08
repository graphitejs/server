import {
  pick,
  isEmpty,
  isArray,
  isEqual,
  keys,
  get,
  noop,
} from 'lodash';

import { functionName } from '@graphite/utils';

const graphQl = function(target) {
  const nameClass = functionName(target);
  console.log("nameClass ",nameClass)
  const createTypes = target.prototype.createTypes;
  const typesAttr = get(target.prototype, 'Types', '');
  target.prototype.nameClass = nameClass;

  target.prototype.Types = `
    type ${nameClass} implements node {
      id: ID!,
      ${typesAttr}
    }

    ${get(target.prototype, 'oTypes', '')}
  `;

  target.prototype.Resolvers = Object.assign({}, target.prototype.Resolvers);

  if (target.prototype.hasOne) {
    const hasOne = {};
    hasOne[nameClass] = target.prototype.hasOne;
    Object.assign(target.prototype.Resolvers, hasOne);
  }

  if (target.prototype.hasMany) {
    const hasMany = {};
    hasMany[nameClass] = target.prototype.hasMany;
    Object.assign(target.prototype.Resolvers, hasMany);
  }

  if (target.prototype.create) {
    target.prototype.Types += target.prototype.create(nameClass, createTypes);
  }

  if (target.prototype.update) {
    target.prototype.Types += target.prototype.update(nameClass, createTypes);
  }

  if (target.prototype.responseTypeWithError) {
    target.prototype.Types += target.prototype.responseTypeWithError(nameClass);
  }

  target.prototype.Types = `${get(target.prototype, 'Types', '')}`;
  target.prototype.Mutation = get(target.prototype, 'Mutation', () => noop)()(nameClass);
  target.prototype.Query = get(target.prototype, 'Query', () => noop)()(nameClass);
};

export default graphQl;
