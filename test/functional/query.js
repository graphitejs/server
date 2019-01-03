import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
import { Graphite, GraphQL } from '../../src/index'
import { getQuery } from '../Helpers/GetQuery'

const Developer = GraphQL('Developer')({
  name: ['String'],

  Query: {
    'developer: Developer': () => ({ name: 'Wally' }),
    'getDeveloper(name: String): Developer': () => ({ name: 'Wally' }),
  },
})

describe('Graphite Query', async assert => {
  {
    const graphite = await Graphite({ models: [Developer] })

    const query = getQuery('developer { name }')
    const request = await fetch('http://localhost:4000/graphql', query)

    const actual = (await request.json()).data.developer.name
    const expected = 'Wally'

    assert({
      given: 'GraphQl query valid',
      should: 'return the data query',
      actual,
      expected,
    })

    await graphite.stop()
  }

  {
    const graphite = await Graphite({ models: [Developer] })

    const query = getQuery('getDeveloper(name: "Wally") { name }')
    const request = await fetch('http://localhost:4000/graphql', query)

    const actual = (await request.json()).data.getDeveloper.name
    const expected = 'Wally'

    assert({
      given: 'GraphQl query with params',
      should: 'return the data query',
      actual,
      expected,
    })

    await graphite.stop()
  }
})
