import {
  pick,
  isEmpty,
  isArray,
  isEqual,
  keys,
  get,
} from 'lodash';

import { functionName } from 'graphite-utils';

const graphQl = function(target) {
  const name = functionName(target);
  const typesAttr = get(target.prototype, 'Types', '');
  target.prototype.name = name;


  target.prototype.Types = `
    type ${name} {
      _id: String,
      ${typesAttr}
    }

    type Errors {
      key: String,
      message: String!,
    }

    ${get(target.prototype, 'oTypes', '')}
  `;

  if (target.prototype.hasOne) {
    const hasOne = {};
    hasOne[name] = target.prototype.hasOne;
    Object.assign(target.prototype.Resolvers, hasOne);
  }

  if (target.prototype.hasMany) {
    const hasMany = {};
    hasMany[name] = target.prototype.hasMany;
    Object.assign(target.prototype.Resolvers, hasMany);
  }

  if (target.prototype.create || target.prototype.update || target.prototype.remove) {
    const responseTypes = {};
    responseTypes[`response${name}`] = {};
    responseTypes[`response${name}`][name.toLowerCase()] = function(model = {}) {
      return isEmpty(pick(model, Object.keys(get(target.prototype, 'schema', {})))) ? null : model;
    };
    responseTypes[`response${name}`].errors = function(errors) {
      const requiredKeys = ['key', 'message'];
      if (isArray(errors) && isEqual(keys(errors[0]), requiredKeys)) {
        return errors;
      }
      return null;
    };
    Object.assign(target.prototype.Resolvers, responseTypes);

    target.prototype.Types += `
      type response${name} {
        ${name.toLowerCase()}: ${name},
        errors: [Errors],
      }
    `;
  }

  if (target.prototype.create) {
    target.prototype.Types += `
      input create${name} {
        ${target.prototype.createTypes}
      }
    `;
    target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}
                                 ${target.prototype.create(name)}`;
  }

  if (target.prototype.update) {
    target.prototype.Types += `
      input update${name} {
        ${target.prototype.updateTypes}
      }
    `;
    target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}
                                 ${target.prototype.update(name)}`;
  }

  if (target.prototype.remove) {
    target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}
                                 ${target.prototype.remove(name)}`;
  }

  target.prototype.Mutation = `${get(target.prototype, 'Mutation', '')}`;
  target.prototype.Types = `${get(target.prototype, 'Types', '')}`;
  target.prototype.Query = `${get(target.prototype, 'Query', '')}`;
};

export default graphQl;
