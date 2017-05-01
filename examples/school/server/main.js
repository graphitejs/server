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
import gql from 'graphql-tag';
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
  graphQLServer.get('/p/:id', (req, res) => {
    const actualPage = '/post';
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  graphQLServer.get('/about', (req, res) => {
    const actualPage = '/about';
    app.render(req, res, actualPage);
  });

  const items = JSON.stringify([ School, Student, Teacher ].map(model => {
    return { name: lowerFirst(model.nameClass), href: '/View' };
  }));

  const all = `
    query listStudent {
      students {
        _id
        name
        street
        active
      }
    }
  `;

  const getQuery = (model) => {
    return `
      query list${model} {
        ${lowerFirst(model)}s {
          _id
          name
          street
          active
        }
      }
    `;
  };


  graphQLServer.get('/', (req, res) => {
    const actualPage = '/index';
    app.render(req, res, actualPage, { items, all });
  });

  [ School, Student, Teacher ].forEach(model => {
    graphQLServer.get('/' + model.nameClass, (req, res) => {
      const newQuery = getQuery(model.nameClass);
      app.render(req, res, '/View', { items, all: newQuery, model: model.nameClass });
    });
  });

  [ School, Student, Teacher ].forEach(model => {
    console.log("'/api/' + model.nameClass ",'/api/' + model.nameClass);
    graphQLServer.get('/api/' + model.nameClass, (req, res) => {
      const newQuery = getQuery(model.nameClass);
      res.json({ items, all: newQuery, model: model.nameClass });
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
