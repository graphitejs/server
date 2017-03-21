import { expect } from 'chai';
import scalars from '../src/scalars';

describe('Graphite scalars', () => {
  it('should be return an array', (done) => {
    expect(scalars).to.be.array;
    done();
  });

  it('should be an array of objects with Types and Resolvers like properties', (done) => {
    scalars.forEach(scalar => {
      expect(scalar).to.have.property('Types');
      expect(scalar).to.have.property('Resolvers');
    });
    done();
  });
});
