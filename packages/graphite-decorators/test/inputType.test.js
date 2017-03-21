import { expect } from 'chai';
import inputType from '../src/inputType';

describe('inputType', () => {
  let target;
  let key;

  beforeEach(() => {
    target = function() {};
    target.user = 'user';
    key = 'user';
  });

  it('should be a string', (done) => {
    inputType(target, key);
    expect(target.createTypes).to.be.string;
    done();
  });

  it('should be a return string with opertation graphql', (done) => {
    inputType(target, key);
    expect(target.createTypes.trim()).eql('user: user,');
    done();
  });
});
