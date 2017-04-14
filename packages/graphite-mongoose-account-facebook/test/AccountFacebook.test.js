import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
import account, { Model as accountModel } from '@graphite/mongoose-account';

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

  context('When create accountFacebook without params', () => {
    it('Should be throw exeption client_id required', (done) => {
      try {
        /* eslint-disable */
        const accountFacebookMock = new AccountFacebook();
        /* eslint-enable */
      } catch (error) {
        expect(error.message).eql('client_id required');
        done();
      }
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

  const success = [{
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

  const features = [
    {
      context: 'when getAccessToken',
      context2: 'when success facebook napi',
      method: 'getAccessToken',
      success,
    },
    {
      context: 'when getExtendAccessToken',
      context2: 'when success facebook napi',
      method: 'getExtendAccessToken',
      success,
    },
  ];

  features.forEach(feature => {
    context(feature.context, () => {
      context(feature.context2, () => {
        feature.success.forEach(item => {
          context(item.context, () => {
            it(item.titleTest, (done) => {
              const code = '123456';
              sinon.stub(accountFacebook.facebook, 'napi', (url, config, callback) => {
                const result = item.data;
                callback(null, result);
              });
              const getAccessTokenPromise = accountFacebook[feature.method](appId, secret, code, redirect);
              getAccessTokenPromise.then(result => {
                expect(result).to.include.keys('token', 'expires');
                expect(result.token).eql(item.data.access_token);
                expect(result.expires).eql(item.data.expires);
                done();
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
              const getAccessTokenPromise = accountFacebook[feature.method](appId, secret, code, redirect);
              getAccessTokenPromise.then().catch(error => {
                expect(error).eql('error');
                done();
              });
            });
          });
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

  context('when generateAppToken', () => {
    it('should return string with content script', () => {
      const user = {
        userId: '123456',
      };

      const JwSToken = {
        SECRET: '123456',
        EXPIRES_IN: '2d',
      };

      const result = accountFacebook.generateAppToken(user, JwSToken);
      expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
    });
  });

  context('when callbackFacebook', () => {
    context('when success', () => {
      context('when user is new', () => {
        context('when not has onBeforeCreateCallback and onAfterCreateCallback', () => {
          it('Should execute all methods getAccessToken, getExtendAccessToken, getMe, generateAppToken, Model.findOne, Model.create and accountModel.create', (done) => {
            const reqToken = {
              loginToken: '123456',
              loginTokenExpires: 0,
              userId: '123456',
            };

            sinon.stub(accountFacebook, 'getAccessToken', () => Promise.resolve('123456'));
            sinon.stub(accountFacebook, 'getExtendAccessToken', () => Promise.resolve({ token: '123456' }));
            sinon.stub(accountFacebook, 'getMe', () => Promise.resolve({ id: '123456', first_name: 'GraphiteJS' }));
            sinon.stub(accountFacebook, 'generateAppToken', () => reqToken);
            sinon.stub(accountFacebook.Model, 'findOne', () => Promise.resolve(null));
            sinon.stub(accountFacebook.Model, 'create', () => ({ _id: '123456' }));
            sinon.stub(accountModel, 'create', () => ({ _id: '123456' }));

            const req = {
              query: {
                code: '1234',
              },
            };
            const res = {
              write: sinon.spy(),
            };

            const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
            callbackFacebookPromise.then(() => {
              expect(accountFacebook.getAccessToken).to.have.been.called;
              expect(accountFacebook.getExtendAccessToken).to.have.been.called;
              expect(accountFacebook.getMe).to.have.been.called;
              expect(accountFacebook.generateAppToken).to.have.been.called;
              expect(accountFacebook.Model.findOne).to.have.been.called;
              expect(accountFacebook.Model.create).to.have.been.called;
              expect(accountModel.create).to.have.been.called;
              expect(res.write).to.have.been.called;
              accountFacebook.getAccessToken.restore();
              accountFacebook.getExtendAccessToken.restore();
              accountFacebook.getMe.restore();
              accountFacebook.generateAppToken.restore();
              accountFacebook.Model.findOne.restore();
              accountFacebook.Model.create.restore();
              accountModel.create.restore();
              done();
            });
          });
        });

        context('when has onBeforeCreateCallback and onAfterCreateCallback', () => {
          it('Should execute all methods getAccessToken, getExtendAccessToken, getMe, generateAppToken, Model.findOne, Model.create, accountModel.create, onBeforeCreateCallback and onAfterCreateCallback', (done) => {
            const reqToken = {
              loginToken: '123456',
              loginTokenExpires: 0,
              userId: '123456',
            };

            account.onBeforeCreateCallback = () => {};
            account.onAfterCreateCallback = () => {};

            sinon.stub(accountFacebook, 'getAccessToken', () => Promise.resolve('123456'));
            sinon.stub(accountFacebook, 'getExtendAccessToken', () => Promise.resolve({ token: '123456' }));
            sinon.stub(accountFacebook, 'getMe', () => Promise.resolve({ id: '123456', first_name: 'GraphiteJS' }));
            sinon.stub(accountFacebook, 'generateAppToken', () => reqToken);
            sinon.stub(accountFacebook.Model, 'findOne', () => Promise.resolve(null));
            sinon.stub(accountFacebook.Model, 'create', () => ({ _id: '123456' }));
            sinon.stub(accountModel, 'create', () => ({ _id: '123456' }));
            sinon.stub(account, 'onBeforeCreateCallback', () => ({ _id: '123456' }));
            sinon.stub(account, 'onAfterCreateCallback', () => ({ _id: '123456' }));

            const req = {
              query: {
                code: '1234',
              },
            };
            const res = {
              write: sinon.spy(),
            };

            const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
            callbackFacebookPromise.then(() => {
              expect(accountFacebook.getAccessToken).to.have.been.called;
              expect(accountFacebook.getExtendAccessToken).to.have.been.called;
              expect(accountFacebook.getMe).to.have.been.called;
              expect(accountFacebook.generateAppToken).to.have.been.called;
              expect(accountFacebook.Model.findOne).to.have.been.called;
              expect(accountFacebook.Model.create).to.have.been.called;
              expect(accountModel.create).to.have.been.called;
              expect(res.write).to.have.been.called;
              expect(account.onBeforeCreateCallback).to.have.been.called;
              expect(account.onAfterCreateCallback).to.have.been.called;
              accountFacebook.getAccessToken.restore();
              accountFacebook.getExtendAccessToken.restore();
              accountFacebook.getMe.restore();
              accountFacebook.generateAppToken.restore();
              accountFacebook.Model.findOne.restore();
              accountFacebook.Model.create.restore();
              accountModel.create.restore();
              account.onBeforeCreateCallback.restore();
              account.onAfterCreateCallback.restore();
              done();
            });
          });
        });
      });

      context('when user exists', () => {
        it('Should execute all methods getAccessToken, getExtendAccessToken, getMe, Model.findOne and Model.create', (done) => {
          sinon.stub(accountFacebook, 'getAccessToken', () => Promise.resolve('123456'));
          sinon.stub(accountFacebook, 'getExtendAccessToken', () => Promise.resolve({ token: '123456' }));
          sinon.stub(accountFacebook, 'getMe', () => Promise.resolve({ id: '123456', first_name: 'GraphiteJS' }));
          sinon.stub(accountFacebook.Model, 'findOne', () => Promise.resolve({ _id: '123456' }));
          sinon.spy(accountFacebook.Model, 'create');
          sinon.spy(accountModel, 'create');

          const req = {
            query: {
              code: '1234',
            },
          };
          const res = {
            write: sinon.spy(),
          };

          const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
          callbackFacebookPromise.then(() => {
            expect(accountFacebook.getAccessToken).to.have.been.called;
            expect(accountFacebook.getExtendAccessToken).to.have.been.called;
            expect(accountFacebook.getMe).to.have.been.called;
            expect(accountFacebook.Model.findOne).to.have.been.called;
            expect(accountFacebook.Model.create).to.have.not.been.called;
            expect(accountModel.create).to.have.not.been.called;
            expect(res.write).to.have.been.called;
            accountFacebook.getAccessToken.restore();
            accountFacebook.getExtendAccessToken.restore();
            accountFacebook.getMe.restore();
            accountFacebook.Model.findOne.restore();
            accountFacebook.Model.create.restore();
            accountModel.create.restore();
            done();
          });
        });
      });
    });

    context('when failed', () => {
      context('when fail request api', () => {
        it('Should be execute logger with \'Error with login\'', (done) => {
          sinon.spy(accountFacebook, 'logger');
          const req = {
            query: {
              error: 'error',
            },
          };
          const res = {
            write: sinon.spy(),
          };

          const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
          callbackFacebookPromise.then(() => {
            expect(accountFacebook.logger).to.have.been.calledWith('Error with login');
            expect(res.write).to.have.been.called;
            done();
          });
        });
      });

      context('when fail all', () => {

      });
    });

    context('when throw error', () => {
      context('when not create newAccount and user', () => {
        it('Shoud return null and not execute the remove of account and user', (done) => {
          const req = {
            query: {
              code: '1234',
            },
          };
          const res = {
            write: sinon.spy(),
          };
          const error = 'Error message';

          sinon.stub(accountFacebook, 'getAccessToken');
          accountFacebook.getAccessToken.onCall(0).throws(error);

          sinon.spy(accountFacebook, 'logger');
          sinon.stub(accountFacebook.Model, 'remove', () => Promise.resolve(sinon.spy()) );
          sinon.stub(accountModel, 'remove', () => Promise.resolve(sinon.spy()) );

          const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
          callbackFacebookPromise.then(() => {
            expect(accountFacebook.Model.remove).to.have.not.been.called;
            expect(accountModel.remove).to.have.not.been.called;
            expect(accountFacebook.logger).to.have.been.calledWith(`Error callbackFacebook: ${error}`);
            expect(res.write).to.have.been.called;
            accountFacebook.getAccessToken.restore();
            accountFacebook.logger.restore();
            accountFacebook.Model.remove.restore();
            accountModel.remove.restore();
            done();
          });
        });
      });

      context('when create newAccount and user', () => {
        it('Shoud execute the remove of account and user', (done) => {
          const res = {};
          const req = {
            query: {
              code: '1234',
            },
          };

          res.write = sinon.stub();
          res.write.onCall(0).returns(() => {});
          sinon.stub(accountFacebook, 'getAccessToken', () => Promise.resolve('123456'));
          sinon.stub(accountFacebook, 'getExtendAccessToken', () => Promise.resolve({ token: '123456' }));
          sinon.stub(accountFacebook, 'getMe', () => Promise.resolve({ id: '123456', first_name: 'GraphiteJS' }));
          sinon.stub(accountFacebook, 'generateAppToken', () => reqToken);
          sinon.stub(accountFacebook.Model, 'findOne', () => Promise.resolve(null));
          sinon.stub(accountFacebook.Model, 'create', () => ({ _id: '123456' }));
          sinon.stub(accountModel, 'create', () => ({ _id: '123456' }));
          sinon.spy(accountFacebook, 'logger');
          sinon.stub(accountFacebook.Model, 'remove', () => Promise.resolve(sinon.spy()) );
          sinon.stub(accountModel, 'remove', () => Promise.resolve(sinon.spy()) );

          const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
          callbackFacebookPromise.then(() => {
            expect(accountFacebook.Model.remove).to.have.been.called;
            expect(accountModel.remove).to.have.been.called;
            expect(res.write).to.have.been.called;
            accountFacebook.getAccessToken.restore();
            accountFacebook.getExtendAccessToken.restore();
            accountFacebook.getMe.restore();
            accountFacebook.generateAppToken.restore();
            accountFacebook.Model.findOne.restore();
            accountFacebook.Model.remove.restore();
            accountFacebook.Model.create.restore();
            accountModel.create.restore();
            accountModel.remove.restore();
            res.write.create();
            done();
          });
        });
      });

      context('when create newAccount and not user', () => {
        it('Shoud execute the remove of account and not execute remove of user', (done) => {
          const res = {};
          const req = {
            query: {
              code: '1234',
            },
          };

          res.write = sinon.stub();
          res.write.onCall(0).returns(() => {});
          sinon.stub(accountFacebook, 'getAccessToken', () => Promise.resolve('123456'));
          sinon.stub(accountFacebook, 'getExtendAccessToken', () => Promise.resolve({ token: '123456' }));
          sinon.stub(accountFacebook, 'getMe', () => Promise.resolve({ id: '123456', first_name: 'GraphiteJS' }));
          sinon.stub(accountFacebook, 'generateAppToken', () => reqToken);
          sinon.stub(accountFacebook.Model, 'findOne', () => Promise.resolve(null));
          sinon.stub(accountFacebook.Model, 'create', () => { throw new Error(); });
          sinon.stub(accountModel, 'create', () => ({ _id: '123456' }));
          sinon.spy(accountFacebook, 'logger');
          sinon.stub(accountFacebook.Model, 'remove', () => Promise.resolve(sinon.spy()) );
          sinon.stub(accountModel, 'remove', () => Promise.resolve(sinon.spy()) );

          const callbackFacebookPromise = accountFacebook.callbackFacebook(req, res);
          callbackFacebookPromise.then(() => {
            expect(accountFacebook.Model.remove).to.have.not.been.called;
            expect(accountModel.remove).to.have.been.called;
            expect(res.write).to.have.been.called;
            accountFacebook.getAccessToken.restore();
            accountFacebook.getExtendAccessToken.restore();
            accountFacebook.getMe.restore();
            accountFacebook.generateAppToken.restore();
            accountFacebook.Model.findOne.restore();
            accountFacebook.Model.create.restore();
            accountModel.create.restore();
            res.write.create();
            done();
          });
        });
      });
    });
  });

  context('when loginFacebook', () => {
    it('Should return object with url property', (done) => {
      const result = accountFacebook.loginFacebook();
      expect(result).to.be.object;
      expect(result).to.include.keys('url');
      done();
    });
  });
});
