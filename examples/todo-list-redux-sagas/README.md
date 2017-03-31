# Example GraphiteJS To do list, using Redux and Redux Sagas

Requirement: You have to install **mongo** in your system.


![Alt text](https://github.com/graphitejs/graphitejs/blob/master/examples/todo-list-redux-sagas/screenshot/todo-list.png)

![Alt text](https://github.com/graphitejs/graphitejs/blob/master/examples/todo-list-redux-sagas/screenshot/todo-list-redux.png)

```bash
npm install && npm run start
```


Open browser in **http://localhost:4000** for app

Open browser in **http://localhost:8001/graphiql** for graphiql


```javascript

mutation createTodo($newTodo: createTodo) {
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
}


```

Variables Accounts


```Javascript

{
  "id": "58d91aa3db0abc23f11e8766",
  "newTodo": {
    "name": "Do homework 1",
    "status": true
  },
  "updateTodo": {
    "name": "Do homework 1",
    "status": true
  }
}

```
