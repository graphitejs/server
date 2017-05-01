import ApolloClient, {createNetworkInterface} from 'apollo-client';

export default new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8001/graphql',
    opts: {
      credentials: 'same-origin',
      // Pass headers here if your graphql server requires them
    },
  }),
});
