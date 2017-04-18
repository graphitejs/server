import { database, graphql } from './config/default';
import { Graphite } from '@graphite/apollo-express';
import { Mongodb } from '@graphite/mongoose';
import School from './models/School';
import Student from './models/Student';
import Teacher from './models/Teacher';

const mongoose = new Mongodb(database);
mongoose.connect();

Graphite.graphQLServer({ graphql }, [ School, Student, Teacher ]);
