import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
import { Graphite, GraphQL } from '../../src/index'


describe('Graphite Query', async assert => {
  {
    const Developer = GraphQL('Developer')({
      name: ['String'],

      Query: {
        'developer: Developer': () => ({ name: 'Wally' }),
      },
    })

    const graphite = await Graphite({ models: [Developer] })

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ developer { name } }' }),
    }

    const request = await fetch('http://localhost:4000/graphql', options)

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
})
