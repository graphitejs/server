import isEmpty from 'lodash/isEmpty';

export const typeDefinitionsAll = (Types, Query, Mutation) => {
  return `
    ${Types}

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

    type Mutation {
      ${Mutation}
    }

    schema {
      mutation: Mutation
    }
  `;
};


export default (Types = '', Query = '', Mutation = '') => {
  Mutation = Mutation.trim();
  Query = Query.trim();

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
