import { get, isEmpty, lowerFirst, pick } from 'lodash';

const allMutations = [];

const addMutation = (mutation = () => '') => {
  allMutations.push(mutation);
  return (newMutation = () => '') => {
    allMutations.push(newMutation);
    return (key) => allMutations.map(mutation => `${mutation(key)} \n` ).join('');
  }
}

const validateSchema = (target, newData) => {
  return !isEmpty(pick(newData, Object.keys(get(target, 'schema', {}))));
}

const addResolver = (target, key, descriptor) => {
  return async function() {
      try {
        const nameClass = lowerFirst(target.nameClass);
        const isAllow = get(target[key], 'allow', function() { return true; });
        if (isAllow.bind(target)(...arguments)) {
          const resolveData = await descriptor.value.bind(target)(...arguments);

          if (validateSchema(target, resolveData)) {
            return { [nameClass]: resolveData, errors: null };
          } else {
            return { [nameClass]: null, errors: resolveData };
          }
        }
        return null;
      } catch (error) {
        throw new Error('Decorators query failed. \n' + error);
      }
    };
}

const createInputType = (typeName, createTypes) => {
  return `
    input create${typeName} {
      ${createTypes}
    }`;
}

const updateInputType = (typeName, createTypes) => {
  const pattern = new RegExp(/!/g);
  const parseTypes = createTypes.replace(pattern, '');
  return `
    input update${typeName} {
      ${parseTypes}
    }`;
}

const responseTypeWithError = (typeName) => {
  return `
    type response${typeName} {
      ${lowerFirst(typeName)}: ${typeName},
      errors: [Errors],
    }
  `;
}

const mutation = function(params) {
  return function(target, key, descriptor) {
    const defaultFields = '';
    let newMutation = '';
    let parseFields = '';
    let fields = '';

    switch (typeof params) {
      // { type: 'create'} // return resposeType with errors
      // { type: 'update'} // return resposeType with errors
      // { type: 'remove'} // return resposeType with errors
      // ({ fields: 'id: ID!', responseType: 'Todo' })
      // ('id: ID!') // default return current name Type
      case 'string':
        parseFields = isEmpty(params) ? '' : `(${params})`;
        newMutation = (nameType) => `${key}${parseFields}: [${nameType}],`;
        break;
      case 'object':
        const type = get(params, 'type', false);

        if (type) {
          if (['create', 'update', 'remove'].includes(type)) {
            target.responseTypeWithError = responseTypeWithError;
          }

          if (type == 'create') {
            target.create = createInputType;
            // key name of function for e.g., createTodo
            // createTodo(todo: createTodo): responseTodo
            newMutation = (nameType) => `${key}(${lowerFirst(nameType)}: create${nameType}): response${nameType},`;
            break;
          }

          if (type == 'update') {
            target.update = updateInputType;
            // key name of function for e.g., updateTodo
            // updateTodo(id: ID!, todo: updateTodo): responseTodo
            newMutation = (nameType) => `${key}(id: ID!, ${lowerFirst(nameType)}: update${nameType}): response${nameType},`;
            break;
          }

          if (type == 'remove') {
            // key name of function for e.g., removeTodo
            // removeTodo(id: ID!): responseTodo
            newMutation = (nameType) => `${key}(id: ID!): response${nameType},`;
            break;
          }
        }

        fields = get(params, 'fields', defaultFields);

        if (fields) {
          parseFields = isEmpty(fields) ? '' : `(${params})`;
          newMutation = (nameType) => `${key}${parseFields}: ${get(params, 'responseType', nameType)},`;
          break;
        }

        newMutation = (nameType) => `${key}: ${nameType},`;
        break;
      default:
        newMutation = (nameType) => `${key}: ${nameType},`;
    }

    target.Mutation = addMutation(newMutation);
    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Mutation = Object.assign({}, target.Resolvers.Mutation);
    target.Resolvers.Mutation[key] = addResolver(target, key, descriptor);
  };
};

export default mutation;
