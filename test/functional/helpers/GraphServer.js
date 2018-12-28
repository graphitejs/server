import { Graphite } from '../../../packages/graphite-apollo-express/src/Graphite';

export const GraphServer = (models = []) => {
  const graphQLServer = Graphite().graphQLServer({ graphql: { PORT: 3000 }}, models);

  const stop = async () => {
    graphQLServer.stop();
  };

  return {
    stop,
  };
};
