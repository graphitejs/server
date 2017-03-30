import { apolloExpress, graphiqlExpress } from 'apollo-server';
import typeDefs from './schema';
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import { get, defaultsDeep } from 'lodash';
import scalars from '@graphite/scalars';
import { keys, without } from 'lodash';
import * as defaultConfig from '../config/default';
import debug from 'debug';

export default class GraphQLServer {
  logger = debug('apollo-express');

  constructor(Graphite) {
    this.Graphite = Graphite;
  }

  init(config = defaultConfig, collections = []) {
    const { graphql } = config;
    const { Types, Query, Mutation, Resolvers } = this.register([...collections, ...scalars]);
    const GRAPHQL_PORT = graphql.PORT;
    const formatType = this.formatGraphQlType(Types);

    this.logger(formatType);
    this.logger(this.formatGraphQl(`type Query { ${Query} }`));
    this.logger(this.formatGraphQl(`type Mutation { ${Mutation} }`));
    this.logger(Resolvers);

    try {
      this.executableSchema = makeExecutableSchema({
        typeDefs: typeDefs(formatType, Query, Mutation),
        resolvers: Resolvers,
        logger: { log: this.customLogger.bind(this) },
      });
    } catch (err) {
      this.logger(err);
    }
    collections.filter(this.hasPropertyInitialize.bind(this))
               .forEach(this.executeInitialize.bind(this));

    const apollo = apolloExpress(this.requestApolloExpress.bind(this));

    this.Graphite.use('/graphql', bodyParser.json(), apollo);
    this.Graphite.use('/graphiql', bodyParser.json(), graphiqlExpress({
      endpointURL: '/graphql',
    }));

    this.Graphite.listen(GRAPHQL_PORT, this.listenGraphQl.bind(this, GRAPHQL_PORT));
    return this.Graphite;
  }

  formatGraphQlType(text) {
    const pattern = /\s+/g;
    let formatText = text.replace(pattern, '');
    formatText = formatText.replace(/type/g, 'type ');
    formatText = formatText.replace(/scalar/g, 'scalar ');
    formatText = formatText.replace(/input/g, 'input ');
    formatText = formatText.replace(/:/g, ': ');
    formatText = formatText.replace(/,/g, ',\n\t');
    formatText = formatText.replace(/{/g, ' {\n\t');
    formatText = formatText.replace(/\n\t}/g, '\n}\n\n');
    formatText = formatText + '\n';
    return formatText;
  }

  formatGraphQl(text) {
    let formatText = text.replace(/{/g, '{\n');
    formatText = text.replace(/}/g, '\n}');
    formatText = formatText + '\n';
    return formatText;
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
      Resolvers: {},
    };

    return collections.reduce((acum, collection) => {
      return  {
        Types: acum.Types +' '+get(collection, 'Types', ''),
        Query: acum.Query +' '+get(collection, 'Query', ''),
        Mutation: acum.Mutation +' '+ get(collection, 'Mutation', ''),
        Resolvers: defaultsDeep(acum.Resolvers, collection.Resolvers),
      };
    }, defReduce);
  }
}
