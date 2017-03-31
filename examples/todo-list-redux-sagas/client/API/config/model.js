export const Query = `mutation createTodo($newTodo: createTodo) {
  createTodo(todo: $newTodo) {
    todo {
      _id
      name
      status
    }
    errors {
      key
      message
    }
  }
}

mutation updateTodo($id: String, $updateTodo: updateTodo) {
  updateTodo(id: $id, todo: $updateTodo) {
    todo {
      _id
      name
      status
    }
    errors {
      key
      message
    }
  }
}

mutation removeTodo($id: String) {
  removeTodo(id: $id) {
    todo {
      _id
      name
      status
    }
    errors {
      key
      message
    }
  }
}

query listTodo {
  todo {
    _id
    name
    status
  }
}`;
