import { database, graphql } from './config/default';
import { Graphite } from '@graphite/apollo-express';
import { Mongodb } from '@graphite/mongoose';
import accountWithPassword from './accountWithPassword';
import accountWithFacebook from './accountWithFacebook';
import account from './account';

const mongoose = new Mongodb(database);
mongoose.connect();

Graphite.graphQLServer({ graphql }, [ accountWithPassword, accountWithFacebook, account ]);
