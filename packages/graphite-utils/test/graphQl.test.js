import { expect } from 'chai';
import { registerGhraphQl } from '../src/graphQl';

describe('Graphql', () => {
  describe('When not send parameters', () => {
    it('Should return object', () => {
      const graphql = registerGhraphQl();
      expect(graphql).to.be.an('object');
    });
  });

  describe('When send empty array', () => {
    it('Should return object', () => {
      const graphql = registerGhraphQl();
      expect(graphql).to.be.an('object');
    });
  });

  describe('When send two schemas', () => {
    it('Should return union the schemas', () => {
      const user = {
        Types: 'user { email: String }',
        Query: 'user: user',
        Mutation: 'createUser(user): user',
        Resolvers: {
          user: function() {},
        },
      };

      const profile = {
        Types: 'profile { username: String }',
        Query: 'profile: profile',
        Mutation: 'createProfile(profile): profile',
        Resolvers: {
          profile: function() {},
        },
      };

      const graphql = registerGhraphQl([user, profile]);
      expect(graphql.Types.trim()).eql('user { email: String } profile { username: String }');
      expect(graphql.Query.trim()).eql('user: user profile: profile');
      expect(graphql.Mutation.trim()).eql('createUser(user): user createProfile(profile): profile');
      expect(graphql.Resolvers.user).to.be.function;
      expect(graphql.Resolvers.profile).to.be.function;
    });
  });
});
