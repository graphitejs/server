import JSON from '../../src/types/JSON';
import { Kind } from 'graphql/language';
import { expect } from 'chai';

const { Resolvers } = JSON;

describe('JSON', () => {
  describe('JSON Types', () => {
    it('Should be Types a String', () => {
      expect(JSON.Types).to.be.string;
    });

    it('Should return scalar JSON', () => {
      expect(JSON.Types.trim()).eql('scalar JSON');
    });
  });

  describe('JSON Resolvers', () => {
    it('Should return name JSON', () => {
      expect(Resolvers.JSON.__name).eql('JSON');
    });

    it('Should description a String', () => {
      expect(Resolvers.JSON.__description).to.be.string;
    });

    it('Should return same value when execute __serialize', () => {
      const someValue = 'value';
      expect(Resolvers.JSON.__serialize(someValue)).eql('value');
    });

    it('Should return same value when execute __parseValue', () => {
      const someValue = 'value';
      expect(Resolvers.JSON.__parseValue(someValue)).eql('value');
    });

    describe('When execute __parseLiteral', () => {
      it('Should return null when value not is an Object', () => {
        const ast = {
          kind: Kind.OBJECT,
          value: 'vulponia Rocks!',
        };

        expect(Resolvers.JSON.__parseLiteral(ast)).to.be.null;
      });

      it('Should return String Object when value is an Object', () => {
        const ast = {
          kind: Kind.OBJECT,
          value: { vulponia: 'Rocks!' },
        };

        expect(Resolvers.JSON.__parseLiteral(ast)).to.be.string;
        expect(Resolvers.JSON.__parseLiteral(ast)).eql('{"vulponia":"Rocks!"}');
      });
    });
  });
});
