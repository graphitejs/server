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
import { lowerFirst, upperFirst, get, intersection, without, forEach as forEachObject, omit } from 'lodash';
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

  const getQuery = (model, fields) => {
    return `
      query list${upperFirst(model)} {
        ${pluralize(lowerFirst(model), 2)} {
          ${fields}
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


  const graphqlQuerys = [ School, Student, Teacher ].map(model => {
    const schemaModel = Object.keys(model.schema);
    schemaModel.unshift('_id');
    const hasManyKeys = Object.keys(get(model, 'hasMany', {}) );
    const hasOneKeys = Object.keys(get(model, 'hasOne', {}) );
    const hasManyDiffKeys = intersection(schemaModel, hasManyKeys);
    const hasOneDiffKeys = intersection(schemaModel, hasOneKeys);
    const newSchema = without(schemaModel, ...hasManyDiffKeys, ...hasOneDiffKeys);
    const fields = newSchema.join(' ');
    const obj = {};

    forEachObject(model.schema, data => {
      if (data.type) {
        data.type = functionName(data.type);
      }
    });
    const avoidRelationKeys = omit(model.schema, ...hasManyKeys, ...hasOneKeys);

    hasManyKeys.forEach(key => {
      avoidRelationKeys[key] = {
        type: 'hasMany',
        queryResolver: getQuery(key, '_id'),
      };
    });

    hasOneKeys.forEach(key => {
      avoidRelationKeys[key] = {
        type: 'hasOne',
        queryResolver: getQuery(key, '_id'),
      };
    });

    obj[pluralize(lowerFirst(model.nameClass), 2)] = {};
    obj[pluralize(lowerFirst(model.nameClass), 2)].schema = avoidRelationKeys;
    obj[pluralize(lowerFirst(model.nameClass), 2)].query = getQuery(model.nameClass, fields);
    obj[pluralize(lowerFirst(model.nameClass), 2)].mutation = {};
    obj[pluralize(lowerFirst(model.nameClass), 2)].mutation.remove = getMutationRemove(model.nameClass, fields);
    obj[pluralize(lowerFirst(model.nameClass), 2)].mutation.create = getMutationCreate(model.nameClass, fields);
    return obj;
  });

  graphQLServer.get('/p/:id', (req, res) => {
    const actualPage = '/post';
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  graphQLServer.get('/about', (req, res) => {
    const actualPage = '/about';
    app.render(req, res, actualPage, { items, graphql: graphqlQuerys });
  });

  graphQLServer.get('/', (req, res) => {
    const actualPage = '/index';
    app.render(req, res, actualPage, { items, graphql: graphqlQuerys });
  });

  [ School, Student, Teacher ].forEach(model => {
    graphQLServer.get('/' + model.nameClass, (req, res) => {
      app.render(req, res, '/View', { items, graphql: graphqlQuerys, model: pluralize(lowerFirst(model.nameClass), 2) } );
    });

    graphQLServer.get('/' + model.nameClass.toLowerCase() + '/create', (req, res) => {
      app.render(req, res, '/Create', { items, graphql: graphqlQuerys, model: pluralize(lowerFirst(model.nameClass), 2) } );
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
