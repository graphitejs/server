import next from 'next';
import fetch from 'node-fetch';
import { database, graphql } from './config/default';
import { Graphite } from '@graphite/apollo-express';
import { Mongodb } from '@graphite/mongoose';
import School from './models/School';
import Student from './models/Student';
import Teacher from './models/Teacher';
import { introspectionQuery } from 'graphql/utilities/introspectionQuery';
import { buildClientSchema } from 'graphql/utilities/buildClientSchema';
import { printSchema } from 'graphql/utilities/schemaPrinter';
import { lowerFirst } from 'lodash';
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

  const getQuery = (model) => {
    return `
      query list${model} {
        ${pluralize(lowerFirst(model), 2)} {
          _id
          name
          street
          active
        }
      }
    `;
  };

  const graphqlQuerys = [ School, Student, Teacher ].map(model => {
    const obj = {};
    obj[pluralize(lowerFirst(model.nameClass), 2)] = getQuery(model.nameClass);
    return obj;
  });

  graphQLServer.get('/p/:id', (req, res) => {
    const actualPage = '/post';
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  graphQLServer.get('/about', (req, res) => {
    const actualPage = '/about';
    app.render(req, res, actualPage, { items, graphql: { query: graphqlQuerys } });
  });

  graphQLServer.get('/', (req, res) => {
    const actualPage = '/index';
    app.render(req, res, actualPage, { items, graphql: { query: graphqlQuerys } });
  });

  [ School, Student, Teacher ].forEach(model => {
    graphQLServer.get('/' + model.nameClass, (req, res) => {
      app.render(req, res, '/View', { items, graphql: { query: graphqlQuerys }, model: pluralize(lowerFirst(model.nameClass), 2) } );
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
