import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import LoginFacebook from '@graphite/react-account-facebook';
import { LoginPassword, CreateUser } from '@graphite/react-account-password';
import LogOut from '@graphite/react-account-logout';
import './style/theme.scss';

const networkInterface = createNetworkInterface('http://localhost:4000/graphql');
const client = new ApolloClient({ networkInterface, dataIdFromObject: r => r.id });

ReactDOM.render(
  <ApolloProvider client={client}>
    <div>
      <LoginFacebook />
      <LoginPassword />
      <CreateUser />
      <LogOut />
    </div>
  </ApolloProvider>,
  document.getElementById('app')
);
