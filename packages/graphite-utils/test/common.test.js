import { expect } from 'chai';
import {
  functionName,
} from '../src/common';

describe('Common utils', () => {
  it('Should return function name', () => {
    const newName = function() {};
    const name = functionName(newName);
    expect(name).eql('newName');
  });

  it('Should throw error', () => {
    expect(functionName).to.throw(Error);
  });
});
