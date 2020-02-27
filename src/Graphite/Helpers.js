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

export const getGraphQLSchema = (types = '', query = '', mutation = '', subscription = '', directives = '') => {
  const queries = query === '' ? queryTemplate(createQueryRoot()) : queryTemplate(query)
  const mutations = mutation.trim() === '' ? '' : mutationTemplate(mutation)
  const subscriptions = subscription.trim() === '' ? '' : subscriptionTemplate(subscription)

  return gql`
    ${directives}

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


export const getDirectives = (directives) => {
  const defaultDirective = { schemaDirectives: {}, typeDefsDirectives: '' }

  return directives.reduce((acum, directive) => {
    const schemaDirectives = { ...acum.schemaDirectives, ...directive.schemaDirective }
    const typeDefsDirectives = acum.typeDefsDirectives + ' ' + `directive ${directive.nameDirective}`

    return { schemaDirectives, typeDefsDirectives }
  }, defaultDirective)
}
