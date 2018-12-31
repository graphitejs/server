import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'

import { Graphite, GraphQL, PubSub } from '../../src/index'
import { CreateClient } from '../Helpers/CreateClient'
import { delay } from '../Helpers/Delay'

describe('Graphite Subscription', async assert => {
  {
    const pubsub = new PubSub()
    const DEVELOPER_ADDED = 'DEVELOPER_ADDED'

    const Developer = GraphQL('Developer')({
      name: ['String'],

      Mutation: {
        'createDeveloper(name: String): Developer': (_, { name }) => {
          pubsub.publish(DEVELOPER_ADDED, { developerAdded: { name } })
        },
      },
      Subscription: {
        'developerAdded: Developer': {
          subscribe: () => pubsub.asyncIterator([DEVELOPER_ADDED]),
        },
      },
    })

    const graphite = await Graphite({ models: [Developer] })
    const client = CreateClient()

    const subscription = `subscription {
      developerAdded {
        name
      }
    }`

    client.subscribe(subscription, async(result) => {
      const actual = result.data.developerAdded.name
      const expected = 'Wally'

      assert({
        given: 'GraphQl subscription valid',
        should: 'return the data subscription',
        actual,
        expected,
      })

      client.close()
      await graphite.stop()
    })

    const mutation = `mutation {
      createDeveloper(name: "Wally") {
        name
      }
    }`

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    }

    await delay(2)
    await fetch('http://localhost:4000/graphql', options)
  }
})
