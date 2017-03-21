import express from 'express';
import GraphQLServer from './graphql/graphQLServer';

class Graphite {
  constructor() {
    const app = express();
    const graphQLServer = new GraphQLServer(app);
    this.graphQLServer = graphQLServer.init.bind(graphQLServer);
  }
}

export default { Graphite: new Graphite() };
