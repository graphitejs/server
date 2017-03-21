import { expect } from 'chai';
import type from '../src/type';

describe('type', () => {
  let target;
  let key;
  let descriptor;

  beforeEach(() => {
    target = function() {};
    target.user = 'user';
    key = 'user';
    descriptor = function() {};
    descriptor.value = function() {
      return 'user: user';
    };
  });

  it('should be a string', (done) => {
    type(target, key, descriptor);
    expect(target.oTypes).to.be.string;
    done();
  });
});
