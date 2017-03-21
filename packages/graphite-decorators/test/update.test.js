import { expect } from 'chai';
import update from '../src/update';

describe('update', () => {
  let target;
  let key;

  beforeEach(() => {
    target = function() {};
    key = 'user';
  });

  it('should be a function', (done) => {
    update(target, key);
    expect(target.update).to.be.function;
    done();
  });

  it('should be a return string with opertation graphql', (done) => {
    update(target, key);
    expect(target.update('name')).eql('user(id: String, name: updateName): responseName');
    done();
  });
});
