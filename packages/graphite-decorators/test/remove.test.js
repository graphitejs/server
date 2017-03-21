import { expect } from 'chai';
import remove from '../src/remove';

describe('remove', () => {
  let target;
  let key;

  beforeEach(() => {
    target = function() {};
    key = 'user';
  });

  it('should be a function', (done) => {
    remove(target, key);
    expect(target.remove).to.be.function;
    done();
  });

  it('should be a return string with opertation graphql', (done) => {
    remove(target, key);
    expect(target.remove('name')).eql('user(id: String): responseName');
    done();
  });
});
