import { gql } from 'apollo-server'

const createQueryRoot = () => {
  return `
      "A simple type for getting started!"
      hello: String
  `
}

export const getTypeDefs = (models) => models.map(model => model.Types).join('')

export const getGraphQLSchema = (types = '', query = '', mutation = '', subscription = '') => gql`
  ${types}

  type Query {
    ${query}
  }

  type Mutation {
    ${mutation}
  }

  type Subscription {
    ${subscription}
  }
`

export const getQueries = (type = '') => (models = []) => models.map(model => model[type].map(query => query.definition).join('\n')).join('\n') || createQueryRoot()

export const getResolvers = (type = '') => (models = []) => models.reduce((acum, model) => {
  const resolver = model[type].reduce((x, query) => ({ ...x, ...query.resolver }), {})
  return { ...acum, ...resolver }
}, {})

export const getRelations = (models = []) => models.reduce((acum, model) => {
  return { ...acum, ...model.Relations }
}, {})
