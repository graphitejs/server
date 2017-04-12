import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

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

    accountFacebook.facebook = {
      napi: () => {},
    };
  });

  context('When create accountFacebook', () => {
    it('Should be include this keys redirect, appId, secret, facebook, url, Model', () => {
      expect(accountFacebook).to.include.keys('redirect', 'appId', 'secret', 'facebook', 'url', 'Model');
    });
  });

  context('when execute accountFacebook', () => {
    it('Should be execute this.Model.find', (done) => {
      sinon.spy(accountFacebook.Model, 'find');
      accountFacebook.accountFacebook();
      expect(accountFacebook.Model.find).to.have.been.called;
      accountFacebook.Model.find.restore();
      done();
    });
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

  const features = [{
    context: 'when return has expires',
    titleTest: 'should return token and expires',
    data: {
      access_token: '12345',
      expires: 10,
    },
    expectation: {
      token: '12345',
      expires: 10,
    },
  }, {
    context: 'when return not has expires',
    titleTest: 'should return token and expires with zero(0)',
    data: {
      access_token: '12345',
      expires: 10,
    },
    expectation: {
      token: '12345',
    },
  }];

  context('when getAccessToken', () => {
    context('when success facebook napi', () => {
      features.forEach(feature => {
        context(feature.context, () => {
          it(feature.titleTest, (done) => {
            const code = '123456';
            sinon.stub(accountFacebook.facebook, 'napi', (url, config, callback) => {
              const result = feature.data;
              callback(null, result);
            });
            const getAccessTokenPromise = accountFacebook.getAccessToken(appId, secret, code, redirect);
            getAccessTokenPromise.then(result => {
              expect(result).to.include.keys('token', 'expires');
              expect(result.token).eql(feature.data.access_token);
              expect(result.expires).eql(feature.data.expires);
              done();
            });
          });
        });
      });
    });

  });
  context('when failed facebook napi', () => {
    it('should reject with the error', (done) => {
      const code = '123456';
      sinon.stub(accountFacebook.facebook, 'napi', (url, config, callback) => {
        const result = {
          access_token: '12345',
          expires: 0,
        };
        callback('error', result);
      });
      const getAccessTokenPromise = accountFacebook.getAccessToken(appId, secret, code, redirect);
      getAccessTokenPromise.then().catch(error => {
        expect(error).eql('error');
        done();
      });
    });
  });

  context('when getExtendAccessToken', () => {
    context('when success facebook napi', () => {
      features.forEach(feature => {
        context(feature.context, () => {
          it(feature.titleTest, (done) => {
            const code = '123456';
            sinon.stub(accountFacebook.facebook, 'napi', (url, config, callback) => {
              const result = feature.data;
              callback(null, result);
            });
            const getExtendAccessTokenPromise = accountFacebook.getExtendAccessToken(appId, secret, code, redirect);
            getExtendAccessTokenPromise.then(result => {
              expect(result).to.include.keys('token', 'expires');
              expect(result.token).eql(feature.data.access_token);
              expect(result.expires).eql(feature.data.expires);
              done();
            });
          });
        });
      });
    });

    context('when failed facebook napi', () => {
      it('should reject with the error', (done) => {
        const code = '123456';
        sinon.stub(accountFacebook.facebook, 'napi', (url, config, callback) => {
          const result = {
            access_token: '12345',
            expires: 0,
          };
          callback('error', result);
        });
        const getExtendAccessTokenPromise = accountFacebook.getExtendAccessToken(appId, secret, code, redirect);
        getExtendAccessTokenPromise.then().catch(error => {
          expect(error).eql('error');
          done();
        });
      });
    });
  });
});
