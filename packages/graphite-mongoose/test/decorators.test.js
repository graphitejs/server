import { expect } from 'chai';
import { mongoose, generateObjectId } from '../src/decorators';
import { Mongodb } from '../src/mongoose';

describe('Mongoose decorator', () => {
  let target;
  beforeEach(() => {
    target = function() {};
    target.prototype.name = 'Graphite';
  });

  describe('Has attributes', () => {
    it('should has mongoose', (done) => {
      mongoose(target);
      expect(target.prototype.databaseName).eql('mongoose');
      done();
    });

    it('should has schemaModel', (done) => {
      mongoose(target);
      expect(target.prototype).to.have.property('schemaModel');
      done();
    });

    it('should has Model', (done) => {
      const newTarget = function() {};
      newTarget.prototype.name = 'Graphite-2';
      mongoose(newTarget);
      expect(newTarget.prototype).to.have.property('Model');
      done();
    });
  });

  describe('Functions', () => {
    it('should generate new id type of string', () => {
      const newId = generateObjectId();
      expect(newId).to.be.string;
    });
  });

  describe('Integration Decorator with MongoDB', () => {
    it('should save model', (done) => {
      const newTarget3 = function() {};
      newTarget3.prototype.name = 'Graphite-3';
      newTarget3.prototype.schema = {
        name: String,
      };

      mongoose(newTarget3);
      const { Model } = newTarget3.prototype;

      const connection = new Mongodb();
      connection.connect().then(() => {
        const user = new Model({
          name: 'Vulponia',
        });

        user.save((err, result) => {
          expect(result.name).eql('Vulponia');
          connection.disconnect();
          done();
        });
      });
    });
  });
});
