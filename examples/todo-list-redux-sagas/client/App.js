import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

import './style/theme.scss';

ReactDOM.render(
  <Provider store={store()}>
    <div>
      <h1> GraphiteJS Todo list </h1>
      <AddTodo />
      <TodoList />
    </div>
  </Provider>,
  document.getElementById('app')
);
