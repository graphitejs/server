import { SchemaDirectiveVisitor } from 'apollo-server'

export const GraphQLDirective = (nameDirective) => (resolver) => {
  const directive = class CustomDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
      return resolver.visitFieldDefinition(field)
    }
  }
  const keyName = nameDirective.split(' ')[0].replace('@', ' ').trim()

  return { nameDirective, schemaDirective: { [keyName]: directive }}
}
