import { types } from '../actions/todos';

const initialState = {
  loading: true,
  todo: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
  case types.GET_TODOS_RESOLVED:
    return {
      loading: false,
      todo: action.payload.data.todo,
    };
  case types.CREATE_TODO_RESOLVED:
    return {
      ...state,
      todo: [
        ...state.todo,
        action.response.data.createTodo.todo,
      ],
    };
  case types.UPDATE_TODO_RESOLVED:
    return {
      ...state,
      todo: state.todo.map(todo => todo._id === action.payload.data.updateTodo.todo._id ?
        action.payload.data.updateTodo.todo : todo
      ),
    };
  case types.REMOVE_TODO_RESOLVED:
    return {
      ...state,
      todo: state.todo.filter(todo => todo._id !== action.payload.id),
    };
  default:
    return state;
  }
};
