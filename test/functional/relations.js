import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
import { Graphite, GraphQL } from '../../src/index'

describe('Graphite Relations', async assert => {
  {
    const Repository = GraphQL('Repository')({
      name: ['String'],
      url: ['String'],
    })

    const GithubProfile = GraphQL('GithubProfile')({
      url: ['String'],
    })

    const Developer = GraphQL('Developer')({
      name: ['String'],

      'respositories: [Repository]': () => [{ name: 'GraphiteJS', url: 'https://github.com/graphitejs/graphitejs' }],

      'githubProfile: GithubProfile': () => ({ url: 'https://github.com/wzalazar' }),

      Query: {
        'developer: Developer': () => ({ name: 'Walter Zalazar' }),
      },
    })

    const graphite = await Graphite({ models: [Developer, Repository, GithubProfile] })


    const query = `
      { 
        developer { 
          name
          githubProfile {
            url
          }
          respositories {
            name
            url
          }
        } 
      }
    `

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }

    const request = await fetch('http://localhost:4000/graphql', options)

    const actual = (await request.json()).data
    const expected = {
      developer: {
        name: 'Walter Zalazar',
        githubProfile: {
          url: 'https://github.com/wzalazar',
        },
        respositories: [{ name: 'GraphiteJS', url: 'https://github.com/graphitejs/graphitejs' }],
      },
    }

    assert({
      given: 'GraphQl with relations',
      should: 'return data with the relation data',
      actual,
      expected,
    })

    await graphite.stop()
  }
})
