import { expect } from 'chai';
import { functionName } from '../src/utils';
import { registerGhraphQl } from '../src/utils';

describe('Utils', () => {
  describe('Common utils', () => {
    it('Should be functionName a function', () => {
      expect(functionName).to.be.a('function');
    });
  });

  describe('graphql utils', () => {
    it('Should be registerGhraphQl a function', () => {
      expect(registerGhraphQl).to.be.a('function');
    });
  });
});
