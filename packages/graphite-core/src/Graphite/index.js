import { ApolloServer, PubSub } from 'apollo-server'
import pino from 'pino'

import { getTypeDefs, getQueries, getRelations, getGraphQLSchema, getResolvers } from './Helpers'

const logger = pino({
  prettyPrint: true,
})

export const Graphite = async (models) => {
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

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    const { url } = await server.listen()
    logger.info(`🚀  Server ready at ${url}`)
    return { PubSub }
  } catch (e) {
    logger.error({ message: e.message }, 'Error on Graphite Initialization')
  }
}
