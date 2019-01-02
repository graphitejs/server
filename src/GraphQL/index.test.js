import { describe } from 'riteway'
import { GraphQL } from './index'

describe('GraphQL()', async assert => {
  {
    const actual = GraphQL()()
    const expected = {
      name: '',
      Types: '',
      Query: [],
      Mutation: [],
      Subscription: [],
      Relations: {},
    }

    assert({
      given: 'no name and definition',
      should: 'return an default object',
      actual,
      expected,
    })
  }
})
