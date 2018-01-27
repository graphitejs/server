import isEmpty from 'lodash/isEmpty';

const common = `
  interface node {
    id: ID!
  }

  type Errors {
    key: String,
    message: String!,
  }
`;

export const typeDefinitionsAll = (Types, Query, Mutation) => {
  return `
    ${Types}

    ${common}

    type Query {
      ${Query}
    }

    type Mutation {
      ${Mutation}
    }

    schema {
      query: Query
      mutation: Mutation
    }
    `;
};

export const typeDefinitionsWithQuery = (Types, Query) => {
  return `
    ${Types}

    ${common}

    type Query {
      ${Query}
    }

    schema {
      query: Query
    }
    `;
};

export const typeDefinitionsWithMutation = (Types, Mutation) => {
  return `
    ${Types}

    ${common}

    type Mutation {
      ${Mutation}
    }

    schema {
      mutation: Mutation
    }
  `;
};


export default (Types = '', Query = '', Mutation = '') => {
  if (!isEmpty(Query) && !isEmpty(Mutation)) {
    return [typeDefinitionsAll(Types, Query, Mutation)];
  }

  if (!isEmpty(Query)) {
    return [typeDefinitionsWithQuery(Types, Query)];
  }

  if (!isEmpty(Mutation)) {
    return [typeDefinitionsWithMutation(Types, Mutation)];
  }

  return '';
};
