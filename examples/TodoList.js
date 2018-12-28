import { GraphQL, Graphite, PubSub } from '../src/index'

const pubsub = new PubSub();
const TODO_ADDED = 'TODO_ADDED';
const TODO_UPDATED = 'TODO_UPDATED';

export const Item = GraphQL('Item')({
  name: ['String!', 'Is a String'],
})

export const Todo = GraphQL('Todo')({
  name: ['String!', 'Is a String'],
  status: ['Boolean', 'Is a Bolean'],

  'items: [Item]': async () => {
    return [{ name: 'item' }]
  },

  'item: Item': async () => {
    return { name: 'item' }
  },

  Query: {
    'todos: [Todo] @deprecated(reason: "renamed to getUser")': () => 'todos',
    'todo: Todo': () => ({ name: 'todo', status: true }),
  },
  Subscription: {
    'todoAdded: Todo': {
      subscribe: () => pubsub.asyncIterator([TODO_ADDED]),
    },
    'todoUpdated: Todo': {
      subscribe: () => pubsub.asyncIterator([TODO_UPDATED]),
    }
  },
  Mutation: {
    'createTodo(name: String, status: Boolean): Todo': (_, { name, status }) => {
      pubsub.publish(TODO_ADDED, { todoAdded: { name, status } })
      return { name, status }
    },
    'updateTodo(name: String, status: Boolean): Todo': (_, { name, status }) => {
      pubsub.publish(TODO_UPDATED, { todoUpdated: { name, status } })
      return { name, status }
    },
  },
})

export const Todo2 = GraphQL('Todo2')({
  name: ['String!', 'Is a String'],
  status: ['Boolean', 'Is a Bolean'],
  Query: {
    'todos2: [Todo2]': () => 'todos',
    'todo2: Todo2': () => ({ name: 'todo', status: true }),
  },
})

Graphite([Todo, Todo2, Item])
