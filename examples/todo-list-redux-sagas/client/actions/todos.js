export const types = {
  GET_TODOS: 'GET_TODOS',
  GET_TODOS_RESOLVED: 'GET_TODOS_RESOLVED',
  CREATE_TODO: 'CREATE_TODO',
  CREATE_TODO_RESOLVED: 'CREATE_TODO_RESOLVED',
  UPDATE_TODO: 'UPDATE_TODO',
  UPDATE_TODO_RESOLVED: 'UPDATE_TODO_RESOLVED',
  REMOVE_TODO: 'REMOVE_TODO',
  REMOVE_TODO_RESOLVED: 'REMOVE_TODO_RESOLVED',
  ERROR_REQUEST: 'ERROR_REQUEST',
};

export const actions = {
  getTodos() {
    return {
      type: types.GET_TODOS,
    };
  },
  getTodosResolved(response, payload) {
    return {
      type: types.GET_TODOS_RESOLVED,
      response,
      payload,
    };
  },
  updateTodo(payload) {
    return {
      type: types.UPDATE_TODO,
      payload,
    };
  },
  createTodoResolved(response, payload) {
    return {
      type: types.CREATE_TODO_RESOLVED,
      response,
      payload,
    };
  },
  createTodo(payload) {
    return {
      type: types.CREATE_TODO,
      payload,
    };
  },
  updateTodoResolved(response, payload) {
    return {
      type: types.UPDATE_TODO_RESOLVED,
      response,
      payload,
    };
  },
  removeTodo(payload) {
    return {
      type: types.REMOVE_TODO,
      payload,
    };
  },
  removeTodoResolved(response, payload) {
    return {
      type: types.REMOVE_TODO_RESOLVED,
      response,
      payload,
    };
  },
  requestError(error = {}) {
    return {
      type: types.ERROR_REQUEST,
      error,
    };
  },
};
