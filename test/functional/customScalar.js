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

const DeveloperWithOdd = GraphQL('Developer')({
  created: ['Date'],
  odd: ['Odd'],

  Query: {
    'getDeveloper(created: Date, odd: Odd): Developer': (_, {created, odd}) => ({ created, odd }),
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

const oddValue = (value) => value % 2 === 1 ? value : null

const CustomScalarOdd = GraphQLScalar('Odd', 'Odd custom scalar type')({
  parseValue: oddValue,
  serialize: oddValue,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return oddValue(parseInt(ast.value, 10))
    }
    return null
  },
})

describe('Graphite Custom Scalar', async assert => {
  {
    const scalars = [CustomScalarDate]
    const graphite = await Graphite({ models: [Developer], scalars })

    const date = new Date()
    const created = date.getTime()

    const query = getQuery(`getDeveloper(created: ${created} ) { created }`)
    const request = await fetch('http://localhost:4000/graphql', query)

    const actual = (await request.json()).data.getDeveloper.created
    const expected = created

    assert({
      given: 'GraphQl with Custom Scalar',
      should: 'return the data proccess for the custom scalar',
      actual,
      expected,
    })

    await graphite.stop()
  }

  {
    const scalars = [CustomScalarDate, CustomScalarOdd]
    const graphite = await Graphite({ models: [DeveloperWithOdd], scalars })

    const date = new Date()
    const created = date.getTime()

    {
      const odd = 3

      const query = getQuery(`getDeveloper(created: ${created}, odd: ${odd} ) { created, odd }`)
      const request = await fetch('http://localhost:4000/graphql', query)

      const actual = (await request.json()).data.getDeveloper
      const expected = { created, odd }

      assert({
        given: 'GraphQl with Two Custom Scalar',
        should: 'return the odd value',
        actual,
        expected,
      })
    }

    {
      const odd = 2

      const query = getQuery(`getDeveloper(created: ${created}, odd: ${odd} ) { created, odd }`)
      const request = await fetch('http://localhost:4000/graphql', query)

      const actual = (await request.json()).data.getDeveloper
      const expected = { created, odd: null }

      assert({
        given: 'GraphQl with Two Custom Scalar',
        should: 'return null in the odd value',
        actual,
        expected,
      })
    }

    await graphite.stop()
  }
})
