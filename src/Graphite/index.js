import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import http from 'http'
import pino from 'pino'

import { getTypeDefs, getQueries, getRelations, getGraphQLSchema, getResolvers } from './Helpers'

const logger = pino({
  prettyPrint: true,
})

export const Graphite = async({ models = [], path = '/graphql' } = {}) => {
  try {
    const types = getTypeDefs(models)
    const query = getQueries('Query')(models)
    const mutation = getQueries('Mutation')(models)
    const subscription = getQueries('Subscription')(models)
    const relations = getRelations(models)

    const typeDefs = getGraphQLSchema(types, query, mutation, subscription)
    const resolvers = {
      Query: getResolvers('Query')(models),
      Mutation: getResolvers('Mutation')(models),
      Subscription: getResolvers('Subscription')(models),
      ...relations,
    }

    const apollo = new ApolloServer({
      typeDefs,
      resolvers,
    })

    const app = express()
    apollo.applyMiddleware({ app, path })
    const server = http.createServer(app)
    apollo.installSubscriptionHandlers(server)

    const serverGraphQl = await server.listen({ port: 4000 })

    logger.info(`🚀  Server Graphite ready at http://localhost:4000${apollo.graphqlPath}`)

    const stop = () => {
      return new Promise((resolve) => {
        serverGraphQl.close(() => {
          logger.info('⛄️  Closing Graphite')
          resolve()
        })
      })
    }

    return { stop }
  } catch (e) {
    logger.error({ message: e.message }, 'Error on Graphite Initialization')
    return { stop }
  }
}
