import MongoMemoryServer from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

import { Graphite } from '../../src/index'
import { Todo } from './models'
import { Collection } from './DAO/Collection'

const getDB = async() => {
  const mongoServer = new MongoMemoryServer()
  const uri = await mongoServer.getConnectionString()
  const mongoClient = await MongoClient.connect(uri, { useNewUrlParser: true })
  return mongoClient.db('TodoList')
}

const main = async() => {
  const db = await getDB()
  const todos = db.collection('todo')

  await Graphite({ models: [Todo(Collection(todos))] })
}

main()
