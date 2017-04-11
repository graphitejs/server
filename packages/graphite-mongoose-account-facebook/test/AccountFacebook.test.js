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
    accountFacebook.Model = {
      create: () => {},
      find: () => {},
      findOne: () => {},
      remove: () => {},
      findOneAndUpdate: () => {},
    };
  });

  it('Should be include this keys redirect, appId, secret, facebook, url, Model', () => {
    expect(accountFacebook).to.include.keys('redirect', 'appId', 'secret', 'facebook', 'url', 'Model');
  });

  context('when execute findAccount', () => {
    it('Should be execute this.Model.find', (done) => {
      sinon.spy(accountFacebook.Model, 'findOne');
      accountFacebook.findAccount({ _id: '123456' });
      expect(accountFacebook.Model.findOne).to.have.been.called;
      accountFacebook.Model.findOne.restore();
      done();
    });
  });

  context('when initialize', () => {
    it('Should create endpoint /login/facebook', (done) => {
      const app = {
        get: sinon.spy(),
      };

      accountFacebook.initialize(app);
      expect(app.get).to.have.been.calledWith('/login/facebook');
      done();
    });
  });
});
