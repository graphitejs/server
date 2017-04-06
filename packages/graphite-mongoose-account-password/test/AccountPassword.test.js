import { expect } from 'chai';
import AccountPassword from '../src/AccountPassword';

describe('Mongoose Account Password', () => {
  let accountPassword;

  beforeEach(() => {
    accountPassword = new AccountPassword();
  });

  it('Should be has attribute logger and also has to be a function', () => {
    const { logger } = accountPassword;
    expect(typeof logger === 'function').eql(true);
  });
});
