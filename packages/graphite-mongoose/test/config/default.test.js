import { expect } from 'chai';
import { database } from '../../src/config/default';

describe('Config default', () => {
  it('should has attribute PORT', (done) => {
    expect(database).to.have.property('PORT');
    done();
  });

  it('should attribute PORT equal to 3001', (done) => {
    expect(database.PORT).eql(3001);
    done();
  });

  it('should has attribute NAME', (done) => {
    expect(database).to.have.property('NAME');
    done();
  });

  it('should attribute NAME equal to Graphite', (done) => {
    expect(database.NAME).eql('Graphite');
    done();
  });
});
