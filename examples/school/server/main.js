import next from 'next';
import { database, graphql } from './config/default';
import { Graphite } from '@graphite/apollo-express';
import { Mongodb } from '@graphite/mongoose';
import School from './models/School';
import Student from './models/Student';
import Teacher from './models/Teacher';

const mongoose = new Mongodb(database);
mongoose.connect();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const graphQLServer =  Graphite.graphQLServer({ graphql }, [ School, Student, Teacher ]);

app.prepare().then(() => {
  graphQLServer.get('/p/:id', (req, res) => {
    const actualPage = '/post';
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  graphQLServer.get('/about', (req, res) => {
    const actualPage = '/about';
    app.render(req, res, actualPage);
  });

  graphQLServer.get('*', (req, res) => {
    return handle(req, res);
  });

  console.log('> Ready on http://localhost:8001');
}).catch(error => {
  console.error(error.stack);
  process.exit(1);
});
