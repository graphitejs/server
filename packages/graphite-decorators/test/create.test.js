import { expect } from 'chai';
import create from '../src/create';

describe('Create', () => {
  it('should be a function', (done) => {
    const target = function() {};
    const key = 'createUser';
    create(target, key);
    expect(target.create).to.be.function;
    done();
  });

  it('should be a mutation String', (done) => {
    const target = function() {};
    const key = 'createUser';
    create(target, key);
    const mutation = target.create('User');
    expect(mutation).eql('createUser(user: createUser): responseUser');
    done();
  });
});
