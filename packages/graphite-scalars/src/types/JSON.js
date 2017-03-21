import { Kind } from 'graphql/language';

const JSONScalarType = {
  __name: 'JSON',
  __description: `The JSON scalar type represents JSON values as specified by
                  [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).`,
  __serialize(value) {
    return value;
  },
  __parseValue(value) {
    return value;
  },
  __parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT && typeof ast.value === 'object') {
      return JSON.stringify(ast.value); // ast value is always in string format
    }
    return null;
  },
};

const Types = `
  scalar JSON
`;

const Resolvers = {
  JSON: JSONScalarType,
};

export default { Types, Resolvers };
