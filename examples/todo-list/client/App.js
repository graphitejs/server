import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import './style/theme.scss';

const networkInterface = createNetworkInterface('http://localhost:4000/graphql');
const client = new ApolloClient({ networkInterface, dataIdFromObject: r => r.id });

ReactDOM.render(
  <ApolloProvider client={client}>
    <div>
      <AddTodo />
      <TodoList />
    </div>
  </ApolloProvider>,
  document.getElementById('app')
);
