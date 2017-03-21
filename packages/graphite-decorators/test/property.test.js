import { expect } from 'chai';
import property from '../src/property';

import minMax from './fixtures/minMax';
import minMaxExceptions from './fixtures/minMaxExceptions';
import readOnly from './fixtures/readOnly';
import required from './fixtures/required';
import transformToOject from './fixtures/transformToOject';
import unique from './fixtures/unique';

const allTests = [
  minMax,
  minMaxExceptions,
  readOnly,
  required,
  transformToOject,
  unique,
];

describe('Property', () => {
  describe('Tranform property string to Object', () => {
    let target;
    let key;
    let descriptor;

    beforeEach(() => {
      target = function() {};
      key = 'name';
      descriptor = {
        initializer: function() {},
      };
    });

    describe('Property initializer', () => {
      describe('when is undefined', () => {
        it('Should be value default undefined', (done) => {
          const descriptorLocal = {
            initializer: function() {},
          };
          const propertyDecorator = property('String');
          propertyDecorator(target, key, descriptorLocal);
          expect(target.schema.name.default).to.be.undefined;
          done();
        });
      });

      describe('when has value', () => {
        it('Should be value set value default Graphite', (done) => {
          const descriptorLocal = {
            initializer: function() {
              return 'Graphite';
            },
          };
          const propertyDecorator = property('String');
          propertyDecorator(target, key, descriptorLocal);
          expect(target.schema.name.default).eql('Graphite');
          done();
        });
      });
    });

    allTests.forEach(currentFixture => {
      currentFixture.fixtures.forEach(fixture => {
        it(currentFixture.description(fixture), (done) => {
          const propertyDecorator = property(fixture.type);
          propertyDecorator(target, key, descriptor);
          expect(target.schema.name).eql(fixture.expectation);
          done();
        });
      });
    });
  });
});
