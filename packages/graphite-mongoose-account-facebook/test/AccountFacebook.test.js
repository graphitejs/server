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
      api: () => {},
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

  context('when getAccessToken', () => {
    context('when success facebook napi', () => {
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
  });

  context('when getMe', () => {
    it('should return result promise', () => {
      const token = '123456';

      sinon.stub(accountFacebook.facebook, 'api', (url, config, callback) => {
        const result = 'me';
        callback(result);
      });

      const getMePromise = accountFacebook.getMe(token);
      getMePromise.then(result => {
        expect(result).eql('me');
      });
    });
  });

  context('when templateToken', () => {
    it('should return string with content script', () => {
      const script = `
        <script>
          window.localStorage.setItem("Graphite.loginToken", "123456");
          window.localStorage.setItem("Graphite.userId", "123456");
          window.localStorage.setItem("Graphite.loginTokenExpires", "0");

          if (window.opener) {
              window.opener.focus();
          }
          window.close();
        </script>
      `;

      const data = {
        loginToken: '123456',
        userId: '123456',
        loginTokenExpires: 0,
      };

      const result = accountFacebook.templateToken(data);
      expect(result).to.be.string;
      expect(result.replace(/\s/g, '')).eql(script.replace(/\s/g, ''));
    });
  });

  context('when templateError', () => {
    it('should return string with content script', () => {
      const script = `
        <script>
          document.write("Login failed");
          if (window.opener) {
              window.opener.focus();
          }

          setTimeout(function() {
            window.close();
          }, 3000);
        </script>
      `;

      const result = accountFacebook.templateError();
      expect(result).to.be.string;
      expect(result.replace(/\s/g, '')).eql(script.replace(/\s/g, ''));
    });
  });
});
