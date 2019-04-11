import { gql } from 'apollo-server'

const createQueryRoot = () => {
  return `
      "A simple type for getting started!"
      hello: String
  `
}

const mutationTemplate = (mutation) => `type Mutation {
  ${mutation}
}`

const subscriptionTemplate = (subscription) => `type Subscription {
  ${subscription}
}`

const queryTemplate = (query) => `type Query {
  ${query}
}`

export const getTypeDefs = (models) => models.map(model => model.Types).join('')

export const getGraphQLSchema = (scalar = '', types = '', query = '', mutation = '', subscription = '') => {
  const queries = query === '' ? queryTemplate(createQueryRoot()) : queryTemplate(query)
  const mutations = mutation.trim() === '' ? '' : mutationTemplate(mutation)
  const subscriptions = subscription.trim() === '' ? '' : subscriptionTemplate(subscription)

  return gql`
    ${scalar}

    ${types}

    ${queries}

    ${mutations}

    ${subscriptions}
  `
}

export const getQueries = (type = '') => (models = []) => models.map(model => model[type].map(query => query.definition).join('\n')).join('\n')

export const getResolvers = (type = '') => (models = []) => models.reduce((acum, model) => {
  const resolver = model[type].reduce((x, query) => ({ ...x, ...query.resolver }), {})
  return { ...acum, ...resolver }
}, {})

export const getRelations = (models = []) => models.reduce((acum, model) => {
  return { ...acum, ...model.Relations }
}, {})

export const getCustomScalars = (scalars = []) => {
  const customScalars = scalars.reduce((acum, scalar) => {
    const resolvers = { ...acum.resolvers, ...scalar.resolver }
    const typeDefs = acum.typeDefs + ' ' + `scalar ${scalar.properties.name}`

    return { resolvers, typeDefs }
  }, {
    resolvers: {},
    typeDefs: '',
  })

  return customScalars
}
