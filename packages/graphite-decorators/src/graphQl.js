import {
  pick,
  isEmpty,
  isArray,
  isEqual,
  keys,
  get,
} from 'lodash';

import { functionName } from '@graphite/utils';

const graphQl = function(target) {
  const nameClass = functionName(target);
  const typesAttr = get(target.prototype, 'Types', '');
  target.prototype.nameClass = nameClass;

  target.prototype.Types = `
    type ${nameClass} {
      _id: String,
      ${typesAttr}
    }

    type Errors {
      key: String,
      message: String!,
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

  if (target.prototype.create || target.prototype.update || target.prototype.remove) {
    const responseTypes = {};
    responseTypes[`response${nameClass}`] = {};
    responseTypes[`response${nameClass}`][nameClass.toLowerCase()] = function(model = {}) {
      return isEmpty(pick(model, Object.keys(get(target.prototype, 'schema', {})))) ? null : model;
    };
    responseTypes[`response${nameClass}`].errors = function(errors) {
      const requiredKeys = ['key', 'message'];
      if (isArray(errors) && isEqual(keys(errors[0]), requiredKeys)) {
        return errors;
      }
      return null;
    };
    Object.assign(target.prototype.Resolvers, responseTypes);

    target.prototype.Types += `
      type response${nameClass} {
        ${nameClass.toLowerCase()}: ${nameClass},
        errors: [Errors],
      }
    `;
  }

  if (target.prototype.create) {
    target.prototype.Types += `
      input create${nameClass} {
        ${target.prototype.createTypes}
      }
    `;
    target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}
                                 ${target.prototype.create(nameClass)}`;
  }

  if (target.prototype.update) {
    target.prototype.Types += `
      input update${nameClass} {
        ${target.prototype.updateTypes}
      }
    `;
    target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}
                                 ${target.prototype.update(nameClass)}`;
  }

  if (target.prototype.remove) {
    target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}
                                 ${target.prototype.remove(nameClass)}`;
  }

  target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}`;
  target.prototype.Types = `${get(target.prototype, 'Types', '')}`;
  target.prototype.Query = `${get(target.prototype, 'Query', '')}`;
};

export default graphQl;
