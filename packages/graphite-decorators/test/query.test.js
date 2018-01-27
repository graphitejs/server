import { expect } from 'chai';
import query from '../src/query';

describe('query', () => {
  let target;
  let key;
  let descriptor;
  let decoratorQuery;

  beforeEach(() => {
    target = function() {};
    key = 'user';
    descriptor = function() {};
    descriptor.value = function() {
      return 'Graphite';
    };

    decoratorQuery = query();
  });

  it('should be a function', (done) => {
    decoratorQuery(target, key, descriptor);
    expect(target.prototype.query).to.be.function;
    done();
  });

  context('When query not have params', () => {
    it('should be Query a String and contain user(id: String, skip: Int, limit: Int, sort: String): [User], the default is the name of function', (done) => {
      decoratorQuery(target, key, descriptor);
      expect(target.Query).to.have.string;
      expect(target.Query.trim()).eql('user(id: String, skip: Int, limit: Int, sort: String): [User],');
      done();
    });
  });

  context('When query have params and params is a String', () => {
    it('should be Query a String and contain user(name: String): [User]', (done) => {
      decoratorQuery = query('name: String');
      decoratorQuery(target, key, descriptor);
      expect(target.Query).to.have.string;
      expect(target.Query.trim()).eql('user(name: String): [User],');
      done();
    });
  });

  context('When query have params and params is a Object', () => {
    context('When object contain fields and responseType', () => {
      it('should be Query a String and contain user(name: String): [response]', (done) => {
        const params = {
          fields: 'name: String',
          responseType: 'response',
        };
        decoratorQuery = query(params);
        decoratorQuery(target, key, descriptor);
        expect(target.Query).to.have.string;
        expect(target.Query.trim()).eql('user(name: String): [response],');
        done();
      });
    });

    context('When object only contain fields', () => {
      it('should be Query a String and contain user(name: String): [User]', (done) => {
        const params = {
          fields: 'name: String',
        };
        decoratorQuery = query(params);
        decoratorQuery(target, key, descriptor);
        expect(target.Query).to.have.string;
        expect(target.Query.trim()).eql('user(name: String): [User],');
        done();
      });
    });

    context('When object only contain responseType', () => {
      it('should be Query a String and contain user(id: String, skip: Int, limit: Int, sort: String): [response]', (done) => {
        const params = {
          responseType: 'response',
        };
        decoratorQuery = query(params);
        decoratorQuery(target, key, descriptor);
        expect(target.Query).to.have.string;
        expect(target.Query.trim()).eql('user(id: String, skip: Int, limit: Int, sort: String): [response],');
        done();
      });
    });

    context('When object not contain fields and responseType', () => {
      it('should be Query a String and contain user(id: String, skip: Int, limit: Int, sort: String): [User]', (done) => {
        const params = {};
        decoratorQuery = query(params);
        decoratorQuery(target, key, descriptor);
        expect(target.Query).to.have.string;
        expect(target.Query.trim()).eql('user(id: String, skip: Int, limit: Int, sort: String): [User],');
        done();
      });
    });
  });


  it('should be Resolvers a Object', (done) => {
    decoratorQuery(target, key, descriptor);
    expect(target.Resolvers).to.have.object;
    done();
  });

  it('should Resolvers contains object Query', (done) => {
    decoratorQuery(target, key, descriptor);
    expect(target.Resolvers.Query).to.have.object;
    done();
  });

  it('should object Query in the ' + key + ' has a promise', (done) => {
    decoratorQuery(target, key, descriptor);
    expect(target.Resolvers.Query[key]).to.have.function;
    done();
  });

  describe('Promise query', () => {
    describe('Promise success', () => {
      it('should return Graphite', (done) => {
        decoratorQuery(target, key, descriptor);
        target.Resolvers.Query[key]().then(result => {
          expect(result).eql('Graphite');
          done();
        });
      });
    });

    describe('Promise failed', () => {
      it('should return error message', (done) => {
        const descriptorFailed = function() {};
        descriptorFailed.initializer = '';
        decoratorQuery(target, key, descriptorFailed);
        target.Resolvers.Query[key]().catch(error => {
          expect(error.message).to.contain('Decorators query failed.');
          done();
        });
      });
    });
  });
});
