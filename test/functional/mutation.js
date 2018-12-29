import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
import { Graphite, GraphQL } from '../../src/index'


describe('Graphite Mutation', async assert => {
  {
    const Developer = GraphQL('Developer')({
      name: ['String'],

      Mutation: {
        'createDeveloper(name: String): Developer': (_, { name }) => ({ name }),
      },
    })

    const graphite = await Graphite({ models: [Developer] })

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `mutation {
        createDeveloper(name: "Wally") {
          name
        }
      }` }),
    }

    const request = await fetch('http://localhost:4000/graphql', options)

    const actual = (await request.json()).data.createDeveloper.name
    const expected = 'Wally'

    assert({
      given: 'GraphQ mutation valid',
      should: 'return the data sended',
      actual,
      expected,
    })

    await graphite.stop()
  }
})
