import fetch from 'isomorphic-fetch'
import { describe } from 'riteway'
const { Kind } = require('graphql/language')

import { Graphite, GraphQL, GraphQLScalar } from '../../src/index'
import { getQuery } from '../Helpers/GetQuery'

const Developer = GraphQL('Developer')({
  created: ['Date'],

  Query: {
    'getDeveloper(created: Date): Developer': (_, {created}) => ({ created }),
  },
})

const CustomScalarDate = GraphQLScalar('Date', 'Date custom scalar type')({
  parseValue(value) {
    return new Date(value).getTime()
  },

  serialize(value) {
    return new Date(value).getTime()
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    }
    return null
  },
})

describe('Graphite Custom Scalar', async assert => {
  {
    const scalars = [CustomScalarDate]
    const graphite = await Graphite({ models: [Developer], scalars })

    const date = new Date()
    const timestamp = date.getTime()

    const query = getQuery(`getDeveloper(created: ${timestamp} ) { created }`)
    const request = await fetch('http://localhost:4000/graphql', query)

    const actual = (await request.json()).data.getDeveloper.created
    const expected = timestamp

    assert({
      given: 'GraphQl with Custom Scalar',
      should: 'return the data proccess for the custom scalar',
      actual,
      expected,
    })

    await graphite.stop()
  }
})
