import { GraphQL, PubSub } from '../../../src/index'

const pubsub = new PubSub()
const TODO_CREATED = 'TODO_CREATED'
const TODO_UPDATED = 'TODO_UPDATED'
const TODO_REMOVED = 'TODO_REMOVED'

export const Todo = (DAO) => GraphQL('Todo')({
  _id: ['ID'],
  name: ['String!', 'Name of to do list'],
  status: ['Boolean', 'The status'],

  Query: {
    'todos: [Todo]': async() => await DAO.findAll(),

    'todo(_id: ID!): Todo': async(_, { _id }) => await DAO.findOne(_id),
  },

  Mutation: {
    'createTodo(name: String, status: Boolean): Todo': async(_, todo) => {
      const todoCreated = await DAO.create(todo)
      pubsub.publish(TODO_CREATED, { todoCreated })
      return todoCreated
    },

    'updateTodo(_id: ID!, name: String, status: Boolean): Todo': async(_, { _id, ...todo }) => {
      const todoUpdated = await DAO.update(_id, todo)
      pubsub.publish(TODO_UPDATED, { todoUpdated })
      return todoUpdated
    },

    'removeTodo(_id: ID!): Todo': async(_, { _id }) => {
      const todoRemoved = await DAO.removeOne(_id)
      pubsub.publish(TODO_REMOVED, { todoRemoved })
      return todoRemoved
    },
  },

  Subscription: {
    'todoCreated: Todo': {
      subscribe: () => pubsub.asyncIterator([TODO_CREATED]),
    },
    'todoUpdated: Todo': {
      subscribe: () => pubsub.asyncIterator([TODO_UPDATED]),
    },
    'todoRemoved: Todo': {
      subscribe: () => pubsub.asyncIterator([TODO_REMOVED]),
    },
  },
})
