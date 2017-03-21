import { expect } from 'chai';
import * as decorators from '../src/decorators';

describe('Decorators', () => {
  it('should return a Object', (done) => {
    expect(decorators).to.be.object;
    done();
  });
});
