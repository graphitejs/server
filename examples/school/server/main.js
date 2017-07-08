import next from 'next';
import { database, graphql } from './config/default';
import { Graphite } from '@graphite/apollo-express';
import { Mongodb } from '@graphite/mongoose';
import scalars from '@graphite/scalars';

import School from './models/School';
import Student from './models/Student';
import Teacher from './models/Teacher';

const mongoose = new Mongodb(database);
mongoose.connect();

import { GraphiteAdmin } from './admin';
import { getSchema } from './getSchema';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const collections = [ School, Student, Teacher ];
const graphQLServer =  Graphite.graphQLServer({ graphql }, collections, scalars);

GraphiteAdmin(app, graphQLServer, collections);
getSchema('http://localhost:8001/graphql');
