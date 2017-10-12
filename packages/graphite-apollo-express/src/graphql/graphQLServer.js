import { apolloExpress, graphiqlExpress } from 'apollo-server';
import typeDefs from './schema';
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import { get, isEmpty } from 'lodash';
import scalars from '@graphite/scalars';
import { keys, without } from 'lodash';
import * as defaultConfig from '../config/default';
import cors from 'cors';
import debug from 'debug';
import { getSchema } from './getSchema';

export default class GraphQLServer {
  logger = debug('apollo-express');

  constructor(Graphite) {
    this.Graphite = Graphite;
  }

  init(config = defaultConfig, collections = []) {

    const { graphql } = config;
    const { Types, Query, Mutation, Resolvers } = this.register([...collections, ...scalars]);
    const GRAPHQL_PORT = graphql.PORT;

    if (isEmpty(Resolvers.Mutation)) {
      delete Resolvers.Mutation;
    }

    if (isEmpty(Resolvers.Query)) {
      delete Resolvers.Query;
    }

    try {
      this.executableSchema = makeExecutableSchema({
        typeDefs: typeDefs(Types, Query, Mutation),
        resolvers: Resolvers,
        logger: { log: this.customLogger.bind(this) },
      });
    } catch (err) {
      this.logger(err);
    }
    collections.filter(this.hasPropertyInitialize.bind(this))
               .forEach(this.executeInitialize.bind(this));

    const apollo = apolloExpress(this.requestApolloExpress.bind(this));
    this.Graphite.use('/graphql', cors(), bodyParser.json(), apollo);
    this.Graphite.use('/graphiql', bodyParser.json(), graphiqlExpress({
      endpointURL: '/graphql',
    }));

    this.Graphite.listen(GRAPHQL_PORT, this.listenGraphQl.bind(this, GRAPHQL_PORT));
    this.Graphite.getSchema = () => getSchema(`http://localhost:${GRAPHQL_PORT}/graphql`);
    this.Graphite.schema = this.executableSchema;
    return this.Graphite;
  }

  customLogger(e) {
    return this.logger(e.stack);
  }

  listenGraphQl(GRAPHQL_PORT) {
    this.logger(`GraphQL  Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
    this.logger(`Graphiql Server is now running on http://localhost:${GRAPHQL_PORT}/graphiql`);
  }

  hasPropertyInitialize(collection) {
    return typeof collection.initialize === 'function';
  }

  executeInitialize(collection) {
    collection.initialize(this.Graphite);
  }

  requestApolloExpress(req, res) {
    const userId = req.userId;
    return Object.assign({ schema: this.executableSchema, context: { userId, req, res }});
  }

  register(collections = []) {
    const defReduce = {
      Types: '',
      Query: '',
      Mutation: '',
      Resolvers: {
        Mutation: {},
        Query: {},
      },
    };

    return collections.reduce((acum, collection) => {
      const mutationMethods = keys(get(collection, 'Resolvers.Mutation', {}));
      const queryMethods = keys(get(collection, 'Resolvers.Query', {}));
      const resolversNames = without(keys(collection.Resolvers), 'Query', 'Mutation');
      mutationMethods.map((value) => {
        acum.Resolvers.Mutation[value] = collection.Resolvers.Mutation[value].bind(collection);
      });

      queryMethods.map((value) => {
        acum.Resolvers.Query[value] = collection.Resolvers.Query[value].bind(collection);
      });

      resolversNames.forEach(resolverName => {
        const methods = keys(collection.Resolvers[resolverName]);
        methods.forEach(method => {
          acum.Resolvers[resolverName] = Object.assign({}, acum.Resolvers[resolverName]);
          if (typeof collection.Resolvers[resolverName][method] === 'function') {
            acum.Resolvers[resolverName][method] = collection.Resolvers[resolverName][method].bind(collection);
          }
        });
      });

      return  {
        Types: `${acum.Types} ${get(collection, 'Types', '')}`,
        Query: `${acum.Query} ${get(collection, 'Query', '')}`,
        Mutation: `${acum.Mutation} ${get(collection, 'Mutation', '')}`,
        Resolvers: acum.Resolvers,
      };
    }, defReduce);
  }
}
