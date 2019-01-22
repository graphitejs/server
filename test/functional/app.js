import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
import { Graphite } from '../../src/index'

describe('Running Graphite', async assert => {
  {
    const graphite = await Graphite()

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ hello }' }),
    }

    const request = await fetch('http://localhost:4000/graphql', options)

    const actual = (await request.json()).data.hello
    const expected = 'Hello World! 🎉🎉🎉'

    assert({
      given: 'Graphite Server with any configuration',
      should: 'return the default query',
      actual,
      expected,
    })

    await graphite.stop()
  }

  {
    const graphite = await Graphite({ port: 3000 })

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ hello }' }),
    }

    const request = await fetch('http://localhost:3000/graphql', options)

    const actual = (await request.json()).data.hello
    const expected = 'Hello World! 🎉🎉🎉'

    assert({
      given: 'Graphite Server with another port',
      should: 'return the default query',
      actual,
      expected,
    })

    await graphite.stop()
  }
})
