import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import http from 'http'
import pino from 'pino'

import { getTypeDefs, getQueries, getRelations, getGraphQLSchema, getResolvers } from './Helpers'

const logger = pino({
  prettyPrint: true,
})

const queryResolverDefault = { Query: { hello: () => 'Hello World! 🎉🎉🎉' }}

export const Graphite = async({ models = [], path = '/graphql' } = {}) => {
  try {
    const types = getTypeDefs(models)
    const query = getQueries('Query')(models)
    const mutation = getQueries('Mutation')(models)
    const subscription = getQueries('Subscription')(models)
    const relations = getRelations(models)

    const typeDefs = getGraphQLSchema(types, query, mutation, subscription)
    const resolvers = {
      ...query ? { Query: getResolvers('Query')(models) } : queryResolverDefault,
      ...(mutation.trim() === '' ? {} : { Mutation: getResolvers('Mutation')(models) }),
      ...(subscription.trim() === '' ? {} : { Subscription: getResolvers('Subscription')(models) }),
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

    logger.info(`🚀  Server Graphite GraphQL ready at http://localhost:4000${apollo.graphqlPath}`)
    logger.info(`🚀  Server Graphite Subscription ready at ws://localhost:4000${apollo.subscriptionsPath}`)

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
    return {}
  }
}
