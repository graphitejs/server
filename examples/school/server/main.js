import next from 'next';
import fetch from 'node-fetch';
import { database, graphql } from './config/default';
import { Graphite } from '@graphite/apollo-express';
import { Mongodb } from '@graphite/mongoose';
import { functionName } from '@graphite/utils';
import School from './models/School';
import Student from './models/Student';
import Teacher from './models/Teacher';
import { introspectionQuery } from 'graphql/utilities/introspectionQuery';
import { buildClientSchema } from 'graphql/utilities/buildClientSchema';
import { printSchema } from 'graphql/utilities/schemaPrinter';
import { lowerFirst, upperFirst, get, intersection, without, forEach as forEachObject, omit, union } from 'lodash';
import debug from 'debug';
import pluralize from 'pluralize';
const logger = debug('app');

const mongoose = new Mongodb(database);
mongoose.connect();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const graphQLServer =  Graphite.graphQLServer({ graphql }, [ School, Student, Teacher ]);


const getSchema = async function() {
  try {
    const response = await fetch('http://localhost:8001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(JSON.stringify(errors, null, 2));
    }
    const schema = buildClientSchema(data);
    logger(printSchema(schema));
  } catch (e) {
    logger('Error ', e);
  }
};

app.prepare().then(async () => {
  const items = [ School, Student, Teacher ].map(model => {
    return { name: lowerFirst(model.nameClass), href: '/View', query: { model: pluralize(lowerFirst(model.nameClass), 2) }};
  });

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
        data.type = functionName(data.type);
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

  const graphqlQuerys = [ School, Student, Teacher ].map(model => {
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

  [ School, Student, Teacher ].forEach(model => {
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
  getSchema();
}).catch(error => {
  process.exit(1);
});
