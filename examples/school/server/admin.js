import { lowerFirst, upperFirst, get, intersection, without, forEach as forEachObject, omit, union, isArray } from 'lodash';
import { functionName } from '@graphite/utils';
import pluralize from 'pluralize';
import debug from 'debug';
const logger = debug('app');

const getQuery = (model, fields = '', fieldsRealtions = '') => {
  return `
    query list${upperFirst(model)} {
      ${pluralize(lowerFirst(model), 2)} {
        ${fields}
        ${fieldsRealtions}
      }
    }
  `;
};

const getQueryOne = (model, fields = '', fieldsRealtions = '') => {
  return  `
    query list${upperFirst(model)}($id: String) {
      ${pluralize(lowerFirst(model), 2)}(_id: $id) {
        ${fields}
        ${fieldsRealtions}
      }
    }
  `;
};

const getMutationRemove = (model, fields) => {
  return `
    mutation remove${pluralize(upperFirst(model), 1)}($id: String) {
      remove${model}(id: $id) {
        ${pluralize(lowerFirst(model), 1)} {
          ${fields}
        }
        errors {
          key
          message
        }
      }
    }
  `;
};

const getMutationCreate = (model, fields) => {
  const nameModelUppper = pluralize(upperFirst(model), 1);
  const nameModelLower = pluralize(lowerFirst(model), 1);
  return `
    mutation create${nameModelUppper}($new${nameModelUppper}: create${nameModelUppper}) {
      create${nameModelUppper}(${nameModelLower}: $new${nameModelUppper}) {
        ${nameModelLower} {
          ${fields}
        }
        errors {
          key
          message
        }
      }
    }
  `;
};

const getMutationUpdate = (model, fields) => {
  const nameModelUppper = pluralize(upperFirst(model), 1);
  const nameModelLower = pluralize(lowerFirst(model), 1);
  return `
    mutation update${nameModelUppper}($id: String, $update${nameModelUppper}: update${nameModelUppper}) {
      update${nameModelUppper}(id: $id, ${nameModelLower}: $update${nameModelUppper}) {
        ${nameModelLower} {
          ${fields}
        }
        errors {
          key
          message
        }
      }
    }
  `;
};

const getFieldSchema = (model) => {
  const schemaModel = Object.keys(model.schema);
  schemaModel.unshift('_id');
  const hasManyKeys = getKeysHasMany(model);
  const hasOneKeys = getKeysHasOne(model);
  const hasManyDiffKeys = intersection(schemaModel, hasManyKeys);
  const hasOneDiffKeys = intersection(schemaModel, hasOneKeys);
  return without(schemaModel, ...hasManyDiffKeys, ...hasOneDiffKeys);
};

const getKeysHasMany = (model) => {
  return Object.keys(get(model, 'hasMany', {}) );
};

const getKeysHasOne = (model) => {
  return Object.keys(get(model, 'hasOne', {}) );
};

const changeAttFunctionForString = (model) => {
  forEachObject(model.schema, data => {
    if (data.type) {
      const nameFunction = functionName(data.type);
      if (isArray(data.type)) {
        data.type = `[${nameFunction}]`;
      } else {
        data.type = nameFunction;
      }
    }
  });
};

const getFieldsForView = (model) => {
  const newSchema = getFieldSchema(model);
  return get(model, '__admin__.listDisplay', false) ? union(['_id'], intersection(model.__admin__.listDisplay, newSchema)).join(' ') : newSchema.join(' ');
};

const getFieldsForMutation = (model) => {
  const newSchema = getFieldSchema(model);
  return newSchema.join(' ');
};

const keyFilterForView = (model) => {
  const hasManyKeys = getKeysHasMany(model);
  const hasOneKeys = getKeysHasOne(model);
  const keysFilter = get(model, '__admin__.listDisplay', false) ? intersection(model.__admin__.listDisplay, [...hasManyKeys, ...hasOneKeys]) : [...hasManyKeys, ...hasOneKeys];
  const fieldsRealtions = keysFilter.map(key => {
    let defaultKey = '_id';
    if (get(model, `__admin__.${key}`, false)) {
      defaultKey = defaultKey + ' ' + get(model, `__admin__.${key}.fields`, []).join(' ');
    }

    return `${key} { ${defaultKey} }`;
  }).join(' ');

  return fieldsRealtions;
};

const keyFilterForMutation = (model) => {
  let defaultKey = '_id';
  const hasManyKeys = getKeysHasMany(model);
  const hasOneKeys = getKeysHasOne(model);
  const keysFilter = [...hasManyKeys, ...hasOneKeys];
  const fieldsRealtions = keysFilter.map(key => {
    if (get(model, `__admin__.${key}`, false)) {
      defaultKey = defaultKey + ' ' + get(model, `__admin__.${key}.fields`, []).join(' ');
    }
    return `${key} { ${defaultKey} }`;
  }).join(' ');

  return fieldsRealtions;
};


export default class Admin {
  constructor(app, graphQLServer, collections) {
    this.app = app;
    this.graphQLServer = graphQLServer;
    this.collections = collections;
    const items = this.items();
    const graphqlQuerys = this.graphql();
    this.createRoutes(app, graphQLServer, items, graphqlQuerys);
  }

  graphql() {
    return this.collections.map(model => {
      const hasManyKeys = getKeysHasMany(model);
      const hasOneKeys = getKeysHasOne(model);
      const obj = {};

      changeAttFunctionForString(model);

      const avoidRelationKeys = omit(model.schema, ...hasManyKeys, ...hasOneKeys);

      hasManyKeys.forEach(key => {
        let defaultKey = '_id';
        if (get(model, `__admin__.${key}`, false)) {
          defaultKey = defaultKey + ' ' + get(model, `__admin__.${key}.fields`, []).join(' ');
        }
        avoidRelationKeys[key] = {
          type: 'hasMany',
          queryResolver: getQuery(key, defaultKey),
          template: get(model.__admin__, `${key}.template`, ''),
        };
      });

      hasOneKeys.forEach(key => {
        let defaultKey = '_id';
        if (get(model, `__admin__.${key}`, false)) {
          defaultKey = defaultKey + ' ' + get(model, `__admin__.${key}.fields`, []).join(' ');
        }
        avoidRelationKeys[key] = {
          type: 'hasOne',
          queryResolver: getQuery(key, defaultKey),
          template: get(model.__admin__, `${key}.template`, ''),
        };
      });

      obj[pluralize(lowerFirst(model.nameClass), 2)] = {};
      obj[pluralize(lowerFirst(model.nameClass), 2)].schema = avoidRelationKeys;
      obj[pluralize(lowerFirst(model.nameClass), 2)].query = getQuery(model.nameClass, getFieldsForView(model), keyFilterForView(model));
      obj[pluralize(lowerFirst(model.nameClass), 2)].queryOne = getQueryOne(model.nameClass, getFieldsForMutation(model), keyFilterForMutation(model));
      obj[pluralize(lowerFirst(model.nameClass), 2)].mutation = {};
      obj[pluralize(lowerFirst(model.nameClass), 2)].mutation.remove = getMutationRemove(model.nameClass, getFieldsForView(model));
      obj[pluralize(lowerFirst(model.nameClass), 2)].mutation.create = getMutationCreate(model.nameClass, getFieldsForView(model));
      obj[pluralize(lowerFirst(model.nameClass), 2)].mutation.update = getMutationUpdate(model.nameClass, getFieldsForView(model));
      return obj;
    });
  }

  items() {
    return this.collections.map(model => {
      return { name: lowerFirst(model.nameClass), href: '/View', query: { model: pluralize(lowerFirst(model.nameClass), 2) }};
    });
  }

  createRoutes(app, graphQLServer, items, graphqlQuerys) {
    const handle = app.getRequestHandler();

    app.prepare().then(async () => {
      graphQLServer.get('/about', (req, res) => {
        const actualPage = '/About';
        app.render(req, res, actualPage, { items, graphql: graphqlQuerys });
      });

      graphQLServer.get('/', (req, res) => {
        const actualPage = '/Index';
        app.render(req, res, actualPage, { items, graphql: graphqlQuerys });
      });

      graphQLServer.get('/graphiql-view', (req, res) => {
        const actualPage = '/GraphiqlView';
        app.render(req, res, actualPage, { items, graphql: graphqlQuerys });
      });

      this.collections.forEach(model => {
        graphQLServer.get('/' + model.nameClass, (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          app.render(req, res, '/View', { items, graphql: graphqlQuerys, model: pluralize(lowerFirst(model.nameClass), 2) } );
        });

        graphQLServer.get('/' + model.nameClass.toLowerCase() + '/create', (req, res) => {
          app.render(req, res, '/Create', { items, graphql: graphqlQuerys, model: pluralize(lowerFirst(model.nameClass), 2) } );
        });

        graphQLServer.get('/' + model.nameClass.toLowerCase() + '/:id', (req, res) => {
          const id = get(req.params, 'id', '');
          app.render(req, res, '/Update', { id, items, graphql: graphqlQuerys, model: pluralize(lowerFirst(model.nameClass), 2) } );
        });
      });

      graphQLServer.get('*', (req, res) => {
        return handle(req, res);
      });

      logger('> Ready on http://localhost:8001');
    }).catch(error => {
      console.log("error ",error );
      process.exit(1);
    });
  }
}

export const GraphiteAdmin = (app, graphQLServer, collections) => {
  return new Admin(app, graphQLServer, collections);
};
