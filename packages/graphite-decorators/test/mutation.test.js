import { expect } from 'chai';
import mutation from '../src/mutation';

describe('mutation', () => {
  let target;
  let key;
  let descriptor;
  let decoratorMutation;

  beforeEach(() => {
    target = function() {};
    key = 'user';
    descriptor = function() {};
    descriptor.value = function() {
      return 'Graphite';
    };

    decoratorMutation = mutation();
  });

  it('should be a function', (done) => {
    decoratorMutation(target, key, descriptor);
    expect(target.prototype.mutation).to.be.function;
    done();
  });

  describe('Attr Mutation', () => {
    describe('When not have params', () => {
      it('should be Mutation a undefinded', (done) => {
        decoratorMutation(target, key, descriptor);
        expect(target.Mutation).to.be.undefinded;
        done();
      });
    });

    describe('When have params', () => {
      it('should be Mutation a String', (done) => {
        const params = {
          fields: 'name: String, code: String',
          responseType: 'Country',
        };

        const decoratorMutationParams = mutation(params);
        decoratorMutationParams(target, key, descriptor);
        expect(target.Mutation).to.be.string;
        expect(target.Mutation.trim()).eql('user (name: String, code: String): Country,');
        done();
      });
    });
  });

  it('should be Resolvers a Object', (done) => {
    decoratorMutation(target, key, descriptor);
    expect(target.Resolvers).to.have.object;
    done();
  });

  it('should Resolvers contains object Mutation', (done) => {
    decoratorMutation(target, key, descriptor);
    expect(target.Resolvers.Mutation).to.have.object;
    done();
  });

  it('should object Mutation in the ' + key + ' has a promise', (done) => {
    decoratorMutation(target, key, descriptor);
    expect(target.Resolvers.Mutation[key]).to.have.function;
    done();
  });

  describe('Promise mutation', () => {
    describe('Promise success', () => {
      it('should return result', (done) => {
        decoratorMutation(target, key, descriptor);
        target.Resolvers.Mutation[key]().then(result => {
          expect(result).eql('Graphite');
          done();
        });
      });
    });

    describe('Promise failed', () => {
      it('should return error message', (done) => {
        const descriptorFailed = function() {};
        descriptorFailed.initializer = '';
        decoratorMutation(target, key, descriptorFailed);
        target.Resolvers.Mutation[key]().catch(error => {
          expect(error.message).to.contain('Decorators mutation failed.');
          done();
        });
      });
    });
  });
});
