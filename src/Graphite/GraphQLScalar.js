const { GraphQLScalarType } = require('graphql')

export const GraphQLScalar = (name, description) => (resolver) => {
  const properties = {
    name,
    description,
    ...resolver,
  }

  const scalarType = new GraphQLScalarType(properties)
  return { properties, resolver: { [name]: scalarType }}
}
