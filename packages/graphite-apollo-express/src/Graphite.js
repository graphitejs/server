import express from 'express';
import GraphQLServer from './graphql/graphQLServer';

export const Graphite = () => {
  const app = express();
  const graphQL = new GraphQLServer(app);
  const graphQLServer = graphQL.init.bind(graphQL);

  return { graphQLServer }
};
