import { describe } from 'riteway'
import { getRelations, getQueries, getResolvers, getGraphQLSchema } from './Helpers'

describe('getRelations()', async assert => {
  {
    const actual = getRelations()
    const expected = {}

    assert({
      given: 'no relations',
      should: 'return an empty object',
      actual,
      expected,
    })
  }
})

describe('getQueries()', async assert => {
  {
    const actual = getQueries()()
    const expected = ''

    assert({
      given: 'no queries',
      should: 'return an empty string',
      actual,
      expected,
    })
  }
})

describe('getResolvers()', async assert => {
  {
    const actual = getResolvers()()
    const expected = {}

    assert({
      given: 'no queries',
      should: 'return an empty object',
      actual,
      expected,
    })
  }
})


describe('getGraphQLSchema()', async assert => {
  {
    const actual = getGraphQLSchema()
    const expected = 'Document'

    assert({
      given: 'default values',
      should: 'return a graphql kind of Document',
      actual: actual.kind,
      expected,
    })
  }
})
