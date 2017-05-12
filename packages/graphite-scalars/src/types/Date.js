import { Kind } from 'graphql/language';

const DateScalarType = {
  __name: 'Date',
  __description: 'Date custom scalar type',
  __serialize(value) {
    return value.getTime();
  },
  __parseValue(value) {
    return new Date(value);
  },
  __parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
};

const Types = `
  scalar Date
`;

const Resolvers = {
  Date: DateScalarType,
};

export default { Types, Resolvers };
