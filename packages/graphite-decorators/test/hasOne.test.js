import { expect } from 'chai';
import hasOne from '../src/hasOne';

describe('hasOne', () => {
  let target;
  let key;
  let descriptor;

  beforeEach(() => {
    target = function() {};
    key = 'user';
    descriptor = function() {};
    descriptor.value = function() {
      return Promise.resolve('Graphite');
    };
  });

  it('should be a function', (done) => {
    hasOne(target, key, descriptor);
    expect(target.prototype.hasOne).to.be.function;
    done();
  });

  it('should be Types a String and contain user: User,', (done) => {
    hasOne(target, key, descriptor);
    expect(target.Types).to.have.string;
    expect(target.Types.trim()).eql('user: User,');
    done();
  });

  it('should be Types createTypes a String', (done) => {
    hasOne(target, key, descriptor);
    expect(target.createTypes).to.have.string;
    expect(target.createTypes.trim()).eql('user: String,');
    done();
  });

  it('should be Types updateTypes a String', (done) => {
    hasOne(target, key, descriptor);
    expect(target.updateTypes).to.have.string;
    expect(target.updateTypes.trim()).eql('user: String,');
    done();
  });

  describe('Promise hasOne', () => {
    describe('Promise success', () => {
      it('should return result', (done) => {
        hasOne(target, key, descriptor);
        target.hasOne[key.toLowerCase()]().then(result => {
          expect(result).eql('Graphite');
          done();
        });
      });
    });

    describe('Promise failed', () => {
      it('should return error message', (done) => {
        const descriptorFailed = function() {};
        descriptorFailed.initializer = '';
        hasOne(target, key, descriptorFailed);
        target.hasOne[key.toLowerCase()]().catch(error => {
          expect(error.message).to.contain('Decorators hasOne failed.');
          done();
        });
      });
    });
  });
});
