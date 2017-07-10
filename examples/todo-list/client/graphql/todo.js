import gql from 'graphql-tag';

export const todoList = gql `
  query todoList {
    todo {
      id
      status
      name
    }
  }
`;

export const updateTodo = gql `
  mutation updateTodo($id: String, $updateTodo: updateTodo) {
    updateTodo(id: $id, todo: $updateTodo) {
      todo {
        id
        name
        status
      }
      errors {
        key
        message
      }
    }
  }
`;

export const removeTodo = gql `
  mutation removeTodo($id: String) {
    removeTodo(id: $id) {
      todo {
        id
        name
        status
      }
      errors {
        key
        message
      }
    }
  }
`;

export const createTodo = gql `
  mutation createTodo($newTodo: createTodo) {
  createTodo(todo: $newTodo) {
    todo {
      id
      name
      status
    }
    errors {
      key
      message
    }
  }
}
`;

export const options = { pollInterval: 300 };
