import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
import { defaultFieldResolver } from 'graphql'

import { Graphite, GraphQL, GraphQLDirective } from '../../src/index'
import { getQuery } from '../Helpers/GetQuery'

const Developer = GraphQL('Developer')({
  name: ['String @upper'],

  Query: {
    'developer: Developer': () => ({ name: 'Wally' }),
  },
})

const upperDirective = GraphQLDirective('@upper on FIELD_DEFINITION')({
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async(...args) => {
      const result = await resolve.apply(this, args)

      return typeof result === 'string' ? result.toUpperCase() : result
    }
  },
})

describe('Graphite Directive', async assert => {
  {
    const graphite = await Graphite({ models: [Developer], directives: [upperDirective] })

    const query = getQuery('developer { name }')
    const request = await fetch('http://localhost:4000/graphql', query)

    const actual = (await request.json()).data.developer.name
    const expected = 'WALLY'

    assert({
      given: 'GraphQl directive upper',
      should: 'return data uppercase text',
      actual,
      expected,
    })

    await graphite.stop()
  }
})
