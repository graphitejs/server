import { API_PATH, METHODS } from './config/const';
import { HeaderFactory } from './config/helpers';
import { Query } from './config/model';

export default {
  getTodos() {
    return fetch(`${API_PATH}/graphql`, {
      method: METHODS.POST,
      headers: HeaderFactory(),
      body: JSON.stringify({
        operationName: 'listTodo',
        variables: '{}',
        query: Query,
      }),
    });
  },
  createTodo(variables) {
    return fetch(`${API_PATH}/graphql`, {
      method: METHODS.POST,
      headers: HeaderFactory(),
      body: JSON.stringify({
        operationName: 'createTodo',
        variables: variables,
        query: Query,
      }),
    });
  },
  updateTodo(variables) {
    return fetch(`${API_PATH}/graphql`, {
      method: METHODS.POST,
      headers: HeaderFactory(),
      body: JSON.stringify({
        operationName: 'updateTodo',
        variables: variables,
        query: Query,
      }),
    });
  },
  removeTodo(variables) {
    return fetch(`${API_PATH}/graphql`, {
      method: METHODS.POST,
      headers: HeaderFactory(),
      body: JSON.stringify({
        operationName: 'removeTodo',
        variables: variables,
        query: Query,
      }),
    });
  },
};
