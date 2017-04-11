import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import { Facebook } from 'fb';
import AccountFacebook from '../src/AccountFacebook';

describe('Mongoose Account Facebook', () => {
  const appId = '12345';
  const secret = '123456';
  const redirect = 'http://localhost';
  let accountFacebook;

  beforeEach(() => {
    accountFacebook = new AccountFacebook(appId, secret, redirect);
  });

  it('Should be include this keys redirect, appId, secret, facebook, url', () => {
    expect(accountFacebook).to.include.keys('redirect', 'appId', 'secret', 'facebook', 'url');
  });
});
