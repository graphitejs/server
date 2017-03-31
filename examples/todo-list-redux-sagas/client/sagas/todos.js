import { call, put, takeLatest } from 'redux-saga/effects';
import { types, actions } from '../actions/todos';
import TodosAPI from '../API/todos';

/**
 * Get the todo list
 */
function* getTodos() {
  try {
    const response = yield call(TodosAPI.getTodos);
    if (response.ok) {
      yield put(actions.getTodosResolved(response, yield response.json()));
    } else throw response;
  } catch (error) {
    yield put(actions.requestError(error));
  }
}

/**
 * CReate a new todo for the todo list
 * @param {object} Todo - Payload with the todo variables object
 */
function* createTodo({payload}) {
  try {
    const response = yield call(TodosAPI.createTodo, payload.variables);
    if (response.ok) {
      yield put(actions.createTodoResolved(yield response.json(), payload));
    } else throw response;
  } catch (error) {
    yield put(actions.requestError(error));
  }
}

/**
 * Update a specific todo of the todo list
 * @param {object} Todo - Payload with the todo variables object
 */
function* updateTodo({payload}) {
  try {
    const response = yield call(TodosAPI.updateTodo, payload.variables);
    if (response.ok) {
      const payloadJSON = yield response.json();
      if (payloadJSON.data.updateTodo) {
        yield put(actions.updateTodoResolved(response, payloadJSON));
      }
    } else throw response;
  } catch (error) {
    yield put(actions.requestError(error));
  }
}

/**
 * Remove a specific todo of the todo list
 * @param {object} Todo - Payload with the todo variables object
 */
function* removeTodo({payload}) {
  try {
    const response = yield call(TodosAPI.removeTodo, payload.variables);
    if (response.ok) {
      yield put(actions.removeTodoResolved(response, payload.variables));
    } else throw response;
  } catch (error) {
    yield put(actions.requestError(error));
  }
}

/**
 * Log the error in console
 * @param {object} Error - Request error
 */
function* errorRequestHandler({error}) {
  console.log('Error: ', error.message);
}

export default function*() {
  yield takeLatest(types.GET_TODOS, getTodos)
  yield takeLatest(types.CREATE_TODO, createTodo)
  yield takeLatest(types.UPDATE_TODO, updateTodo)
  yield takeLatest(types.REMOVE_TODO, removeTodo)
  yield takeLatest(types.ERROR_REQUEST, errorRequestHandler)
}
