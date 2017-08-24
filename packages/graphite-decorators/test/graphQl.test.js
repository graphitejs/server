import { expect } from 'chai';
import graphQl from '../src/graphQl';

describe('graphQl', () => {
  /* eslint-disable */
  var Accounts;
  var schemaWithOptionErrors;
  /* eslint-disable */

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
    Accounts = function() {};
    Accounts.prototype.Resolvers = () => {};

    schemaWithOptionErrors = `
      type responseAccounts {
        accounts: Accounts,
        errors: [Errors],
      }
    `;
  });

  it('Should be hasOne a function', (done) => {
    Accounts.prototype.hasOne = () => {};
    graphQl(Accounts);
    expect(Accounts.prototype.Resolvers.Accounts).to.be.a('function');
    done();
  });

  it('Should be hasMany a function', (done) => {
    Accounts.prototype.hasMany = () => {};
    graphQl(Accounts);
    expect(Accounts.prototype.Resolvers.Accounts).to.be.a('function');
    done();
  });

  context('when there are created method', () => {
    it('Should create key responseAccounts and errors both contain functions and modify the schema', (done) => {
      const pattern = /\s+/g;
      Accounts.prototype.create = () => {};
      graphQl(Accounts);
      expect(Accounts.prototype.Resolvers.responseAccounts.accounts).to.be.a('function');
      expect(Accounts.prototype.Resolvers.responseAccounts.errors).to.be.a('function');
      expect(Accounts.prototype.Types.replace(pattern, '')).to.contain(schemaWithOptionErrors.replace(pattern, ''));
      done();
    });
  });

  context('when there are update method', () => {
    it('Should create key responseAccounts and errors both contain functions and modify the schema', (done) => {
      const pattern = /\s+/g;
      Accounts.prototype.update = () => {};
      graphQl(Accounts);
      expect(Accounts.prototype.Resolvers.responseAccounts.accounts).to.be.a('function');
      expect(Accounts.prototype.Resolvers.responseAccounts.errors).to.be.a('function');
      expect(Accounts.prototype.Types.replace(pattern, '')).to.contain(schemaWithOptionErrors.replace(pattern, ''));
      done();
    });
  });

  context('when there are remove method', () => {
    it('Should create key responseAccounts and errors both contain functions and modify the schema', (done) => {
      const pattern = /\s+/g;
      Accounts.prototype.remove = () => {};
      graphQl(Accounts);
      expect(Accounts.prototype.Resolvers.responseAccounts.accounts).to.be.a('function');
      expect(Accounts.prototype.Resolvers.responseAccounts.errors).to.be.a('function');
      expect(Accounts.prototype.Types.replace(pattern, '')).to.contain(schemaWithOptionErrors.replace(pattern, ''));
      done();
    });
  });

  describe('errors method', () => {
    context('where there are errors', () => {
      it('Should return identity errors object', (done) => {
        Accounts.prototype.remove = () => {};
        graphQl(Accounts);

        const errors = [{
          key: 'name',
          message: 'name is required',
        }];

        const result = Accounts.prototype.Resolvers.responseAccounts.errors(errors);
        expect(errors).eql(result);
        done();
      });
    });

    context('where not there are errors', () => {
      it('Should return null', (done) => {
        Accounts.prototype.remove = () => {};
        graphQl(Accounts);
        const result = Accounts.prototype.Resolvers.responseAccounts.errors();
        expect(result).to.be.null;
        done();
      });
    });
  });

  describe('responseAccounts.accounts method', () => {
    context('when not there are model', () => {
      it('Should return null', () => {
        Accounts.prototype.remove = () => {};
        graphQl(Accounts);
        const result = Accounts.prototype.Resolvers.responseAccounts.accounts();
        expect(result).to.be.null;
      });
    });

    context('when there are model', () => {
      it('Should return identity model', () => {
        Accounts.prototype.remove = () => {};
        graphQl(Accounts);

        Accounts.prototype.schema = {
          name: String,
        };

        const model = {
          name: String,
        };

        const result = Accounts.prototype.Resolvers.responseAccounts.accounts(model);
        expect(result).eql(model);
      });
    });
  });
});
