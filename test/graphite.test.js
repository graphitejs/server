import { expect } from 'chai';
import { Graphite } from '../src/Graphite';

describe('Graphite', () => {
  it('should be has property graphQLServer', (done) => {
    expect(Graphite).to.include.keys('graphQLServer');
    done();
  });
});
