import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import http from 'http'
import pino from 'pino'

import { getTypeDefs, getQueries, getRelations, getGraphQLSchema, getResolvers, getCustomScalars } from './Helpers'

const logger = pino({
  prettyPrint: true,
})

const queryResolverDefault = { Query: { hello: () => 'Hello World! 🎉🎉🎉' }}

export const Graphite = async({ models = [], scalars = [], path = '/graphql', port = 4000, introspection = true, playground = true } = {}) => {
  const types = getTypeDefs(models)
  const query = getQueries('Query')(models)
  const mutation = getQueries('Mutation')(models)
  const subscription = getQueries('Subscription')(models)
  const relations = getRelations(models)
  const customScalars = getCustomScalars(scalars)

  const typeDefs = getGraphQLSchema(customScalars.typeDefs, types, query, mutation, subscription)
  const resolvers = {
    ...customScalars.resolvers,
    ...query ? { Query: getResolvers('Query')(models) } : queryResolverDefault,
    ...(mutation.trim() === '' ? {} : { Mutation: getResolvers('Mutation')(models) }),
    ...(subscription.trim() === '' ? {} : { Subscription: getResolvers('Subscription')(models) }),
    ...relations,
  }

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection,
    playground,
  })

  const app = express()
  apollo.applyMiddleware({ app, path })
  const server = http.createServer(app)
  apollo.installSubscriptionHandlers(server)

  const graphQLServer = await server.listen({ port })

  logger.info(`🚀  Server Graphite GraphQL ready at http://localhost:${port}${apollo.graphqlPath}`)
  logger.info(`🚀  Server Graphite Subscription ready at ws://localhost:${port}${apollo.subscriptionsPath}`)

  const stop = () => {
    return new Promise((resolve) => {
      graphQLServer.close(() => {
        logger.info('⛄️  Closing Graphite')
        resolve()
      })
    })
  }

  return { stop, graphQLServer, app }
}
