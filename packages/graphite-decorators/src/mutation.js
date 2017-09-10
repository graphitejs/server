import { get, isEmpty, lowerFirst, pick } from 'lodash';

const CREATE = 'create';
const UPDATE = 'update';
const REMOVE = 'remove';
const ACTIONS_TYPES = [CREATE, UPDATE, REMOVE];
const DEFAULT_MUTATION = (nameClass) => `${key}: ${nameClass},`;


const addMutation = (mutations) => (newMutation = []) => (nameClass) =>
                      [...mutations, ...newMutation].map(mutation => `${mutation(nameClass)} \n` ).join('');


// checking if the new data has the all key of the schema
// if not has the the keys we have to consider is a error
const validateSchema = (target, newData) =>
                          !isEmpty(pick(newData, Object.keys(get(target, 'schema', {}))));


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
        throw new Error('Decorators mutation failed. \n' + error);
      }
    };
}

const TYPE_CREATE = {
  inputType: (typeName, createTypes) => {
    return `
      input create${typeName} {
        ${createTypes}
      }`;
  },
  // key name of function for e.g., createTodo
  // createTodo(todo: createTodo): responseTodo
  mutation: key => nameClass => `${key}(${lowerFirst(nameClass)}: create${nameClass}): response${nameClass},`,
}

const TYPE_UPDATE = {
  inputType: (typeName, createTypes) => {
    const pattern = new RegExp(/!/g);
    const parseTypes = createTypes.replace(pattern, '');
    return `
      input update${typeName} {
        ${parseTypes}
      }`;
  },
  // key name of function for e.g., updateTodo
  // updateTodo(id: ID!, todo: updateTodo): responseTodo
  mutation: key => nameClass => `${key}(id: ID!, ${lowerFirst(nameClass)}: update${nameClass}): response${nameClass},`,
}

const TYPE_REMOVE = {
  // key name of function for e.g., removeTodo
  // removeTodo(id: ID!): responseTodo
  mutation: key => nameClass => `${key}(id: ID!): response${nameClass},`,
}

const TYPE_RESPONSE_WITH_ERROR = (typeName) => {
  return `
    type response${typeName} {
      ${lowerFirst(typeName)}: ${typeName},
      errors: [Errors],
    }
  `;
}

const mutation = function(params) {
  return function(target, key, descriptor) {

    let newMutation = '';
    let parseFields = '';

    switch (typeof params) {
      // { type: 'create'} // return resposeType with errors
      // { type: 'update'} // return resposeType with errors
      // { type: 'remove'} // return resposeType with errors
      // ({ fields: 'id: ID!', responseType: 'Todo' })
      // ('id: ID!') // default return current name Type
      case 'string':
        parseFields = isEmpty(params) ? '' : `(${params})`;
        newMutation = (nameClass) => `${key}${parseFields}: ${nameClass},`;
        break;

      case 'object':
        const type = get(params, 'type', false);

        if (ACTIONS_TYPES.includes(type)) {
          target.responseTypeWithError = TYPE_RESPONSE_WITH_ERROR;

          switch (type) {

            case CREATE:
              target.create = TYPE_CREATE.inputType;
              newMutation = TYPE_CREATE.mutation(key);
              break;

            case UPDATE:
              target.update = TYPE_UPDATE.inputType;
              newMutation = TYPE_UPDATE.mutation(key);
              break;

            case REMOVE:
              newMutation = TYPE_REMOVE.mutation(key);
              break;

            default:
              break;
          }
          break;
        }

        const fields = get(params, 'fields', false);

        if (fields) {
          parseFields = isEmpty(fields) ? '' : `(${params})`;
          newMutation = nameClass => `${key}${parseFields}: ${get(params, 'responseType', nameClass)},`;
          break;
        }

        newMutation = DEFAULT_MUTATION;
        break;
      default:
        newMutation = DEFAULT_MUTATION;
    }

    target.MUTATIONS = get(target, 'MUTATIONS', []);
    target.MUTATIONS.push(newMutation);
    target.Mutation = addMutation(target.MUTATIONS);

    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Mutation = Object.assign({}, target.Resolvers.Mutation);
    target.Resolvers.Mutation[key] = addResolver(target, key, descriptor);
  };
};

export default mutation;
