import { expect } from 'chai';
import {
  typeDefinitionsAll,
  typeDefinitionsWithQuery,
  typeDefinitionsWithMutation,
} from '../../src/graphql/schema';

import schema from '../../src/graphql/schema';

describe('schema', () => {
  /* eslint-disable */
  var Types, Query, Mutation;
  var expectationWithTypesQueryMutation;
  var expectationWithTypesQuery;
  var expetationWithTypesMutation;
  /* eslint-enable */

  const common = `
    interface node {
      id: ID!
    }

    type Errors {
      key: String,
      message: String!,
    }
  `;

  beforeEach(() => {
    Types = 'types';
    Query = 'query';
    Mutation = 'mutation';
    expectationWithTypesQueryMutation = `
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

    expectationWithTypesQuery = `
      ${Types}

      ${common}

      type Query {
        ${Query}
      }

      schema {
        query: Query
      }
    `;

    expetationWithTypesMutation = `
      ${Types}

      ${common}

      type Mutation {
         ${Mutation}
       }

       schema {
         mutation: Mutation
       }
    `;
  });

  describe('typeDefinitionsAll', () => {
    it('Should create schema complete Types, Query and Mutation', (done) => {
      const result = typeDefinitionsAll(Types, Query, Mutation);
      const pattern = /\s+/g;
      expect(result.replace(pattern, '')).to.contain(expectationWithTypesQueryMutation.replace(pattern, ''));
      done();
    });
  });

  describe('typeDefinitionsWithQuery', () => {
    it('Should create schema with Types and Query', (done) => {
      const result = typeDefinitionsWithQuery(Types, Query);
      const pattern = /\s+/g;
      expect(result.replace(pattern, '')).to.contain(expectationWithTypesQuery.replace(pattern, ''));
      done();
    });
  });

  describe('typeDefinitionsWithMutation', () => {
    it('Should create schema with Types and Mutation', (done) => {
      const result = typeDefinitionsWithMutation(Types, Mutation);
      const pattern = /\s+/g;
      expect(result.replace(pattern, '')).to.contain(expetationWithTypesMutation.replace(pattern, ''));
      done();
    });
  });

  describe('default', () => {
    context('when there are Types, Query and Mutation', () => {
      it('Should return result of expectationWithTypesQueryMutation', (done) => {
        const pattern = /\s+/g;
        const result = schema(Types, Query, Mutation);
        expect(result[0].replace(pattern, '')).to.contain(expectationWithTypesQueryMutation.replace(pattern, ''));
        done();
      });
    });

    context('when there are nothing', () => {
      it('Should return result empty string', (done) => {
        const result = schema();
        expect(result).eql('');
        done();
      });
    });

    context('when there are Types and Query', () => {
      it('Should return result of expectationWithTypesQuery', (done) => {
        const pattern = /\s+/g;
        const result = schema(Types, Query, '');
        expect(result[0].replace(pattern, '')).to.contain(expectationWithTypesQuery.replace(pattern, ''));
        done();
      });
    });

    context('when there are Types and Mutation', () => {
      it('Should return result of expectationWithTypesQuery', (done) => {
        const pattern = /\s+/g;
        const result = schema(Types, '', Mutation);
        expect(result[0].replace(pattern, '')).to.contain(expetationWithTypesMutation.replace(pattern, ''));
        done();
      });
    });

    context('when there are Query and Mutation', () => {
      it('Should return result with Types and Query', (done) => {
        const pattern = /\s+/g;
        const result = schema('', Query, Mutation);
        const expectation = `
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

        expect(result[0].replace(pattern, '')).to.contain(expectation.replace(pattern, ''));
        done();
      });
    });

    context('when there are only Types', () => {
      it('Should return result empty string', (done) => {
        const result = schema(Types, '', '');
        expect(result).eql('');
        done();
      });
    });

    context('when there are only Query', () => {
      it('Should return result with Types and Query', (done) => {
        const pattern = /\s+/g;
        const result = schema('', Query, '');
        const expectation = `
            ${common}

            type Query {
              ${Query}
            }

            schema {
              query: Query
            }
        `;

        expect(result[0].replace(pattern, '')).to.contain(expectation.replace(pattern, ''));
        done();
      });
    });

    context('when there are only Mutation', () => {
      it('Should return result with Types and Query', (done) => {
        const pattern = /\s+/g;
        const result = schema('', '', Mutation);
        const expectation = `
          ${common}
          
          type Mutation {
            ${Mutation}
          }

          schema {
            mutation: Mutation
          }
        `;

        expect(result[0].replace(pattern, '')).to.contain(expectation.replace(pattern, ''));
        done();
      });
    });
  });
});
