import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
import bcrypt from 'bcrypt';
import AccountPassword from '../src/AccountPassword';
import account, { Model as accountModel } from '@graphite/mongoose-account';


describe('Mongoose Account Password', () => {
  let accountPassword;

  beforeEach(() => {
    accountPassword = new AccountPassword();
    accountPassword.Model = {
      create: () => {},
      find: () => {},
      findOne: () => {},
      remove: () => {},
      findOneAndUpdate: () => {},
    };
  });

  context('when execute accountPassword', () => {
    it('Should be execute this.Model.find', (done) => {
      sinon.spy(accountPassword.Model, 'find');
      accountPassword.accountPassword();
      expect(accountPassword.Model.find).to.have.been.called;
      accountPassword.Model.find.restore();
      done();
    });
  });

  context('when execute findAccount', () => {
    it('Should be execute this.Model.find', (done) => {
      sinon.spy(accountPassword.Model, 'findOne');
      accountPassword.findAccount('123');
      expect(accountPassword.Model.findOne).to.have.been.called;
      accountPassword.Model.findOne.restore();
      done();
    });
  });

  context('when comparePassword', () => {
    context('when the password is incorrect', () => {
      it('Should be return false', (done) => {
        const result = accountPassword.comparePassword('123456', 'aaaaaaaaaaaa');
        expect(result).to.be.false;
        done();
      });
    });

    context('when the password is correct', () => {
      it('Should be return true', (done) => {
        bcrypt.hash('123456', 10, function(err, hash) {
          const result = accountPassword.comparePassword('123456', hash);
          expect(result).to.be.true;
          done();
        });
      });
    });
  });

  context('when formatCallback', () => {
    it('Should be return object with loginToken, loginTokenExpires and userId', (done) => {
      const user = { userId: '123456' };
      const SECRET = 'SECRET';
      const EXPIRES_IN = 10000;

      const result = accountPassword.formatCallback(user, SECRET, EXPIRES_IN);
      expect(result).to.be.object;
      expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
      done();
    });
  });

  context('when createUser', () => {
    context('when email is valid', () => {
      context('when has onBeforeCreateCallback and onAfterCreateCallback', () => {
        it('Shoud contains key loginToken, loginTokenExpires and userId and execute onBeforeCreateCallback and onAfterCreateCallback', (done) => {
          account.onBeforeCreateCallback = () => {};
          account.onAfterCreateCallback = () => ({});
          sinon.stub(accountModel, 'create', () => ({ _id: '123456' } ));
          sinon.stub(accountPassword.Model, 'create', () => ({ userId: '123456' } ));
          sinon.stub(account, 'onBeforeCreateCallback', () => ({ password: '12345' }) );
          sinon.stub(account, 'onAfterCreateCallback', () => ({}) );

          const email = 'graphite@graphite.com';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
            expect(account.onBeforeCreateCallback).to.have.been.called;
            expect(account.onAfterCreateCallback).to.have.been.called;
            accountModel.create.restore();
            accountPassword.Model.create.restore();
            account.onBeforeCreateCallback.restore();
            account.onAfterCreateCallback.restore();
            done();
          });
        });
      });

      context('when not has onBeforeCreateCallback and onAfterCreateCallback', () => {
        it('Shoud contains key loginToken, loginTokenExpires and userId and not execute onBeforeCreateCallback and onAfterCreateCallback', (done) => {
          sinon.stub(accountModel, 'create', () => ({ _id: '123456' } ));
          sinon.stub(accountPassword.Model, 'create', () => ({ userId: '123456' } ));
          sinon.spy(accountPassword, 'logger');

          account.onBeforeCreateCallback = undefined;
          account.onAfterCreateCallback = undefined;

          const email = 'graphite@graphite.com';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
            expect(accountPassword.logger).to.have.not.been.calledWith('beforeCreate');
            expect(accountPassword.logger).to.have.not.been.calledWith('onAfterCreateCallback');
            accountModel.create.restore();
            accountPassword.Model.create.restore();
            accountPassword.logger.restore();
            done();
          });
        });
      });
    });

    context('when email is invalid', () => {
      it('Shoud return null', (done) => {
        sinon.stub(accountModel, 'create', () => ({ _id: '123456' } ));
        const email = 'graphite@';
        const password = '12346';
        const createUserPromise = accountPassword.createUser({}, { email, password });
        createUserPromise.then(result => {
          expect(result).to.be.null;
          accountModel.create.restore();
          done();
        });
      });
    });

    context('when throw error', () => {
      context('when not create newAccount and user', () => {
        it('Shoud return null and not execute the remove of account and user', (done) => {
          sinon.spy(accountModel, 'remove');
          sinon.stub(accountPassword.Model, 'remove', () => Promise.resolve(sinon.spy()) );

          accountPassword.logger = sinon.stub();
          accountPassword.logger.onCall(0).throws('TypeError');
          accountPassword.logger.onCall(1).returns('logger');

          const email = 'graphite@';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.be.null;
            expect(accountModel.remove).to.have.not.been.called;
            expect(accountPassword.Model.remove).to.have.not.been.called;
            accountModel.remove.restore();
            accountPassword.Model.remove.restore();
            done();
          });
        });
      });

      context('when create newAccount and user', () => {
        it('Shoud return null and execute the remove of account and user', (done) => {
          sinon.stub(accountModel, 'create', () => ({ _id: '123456' }) );
          sinon.stub(accountModel, 'remove', () => Promise.resolve(sinon.spy()) );
          sinon.stub(accountPassword.Model, 'create', () => ({ userId: '123456' } ));
          sinon.stub(accountPassword.Model, 'remove', () => Promise.resolve(sinon.spy()) );

          account.onAfterCreateCallback = () => {
            throw new Error();
          };

          const email = 'graphite@graphite.com';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.be.null;
            expect(accountModel.remove).to.have.been.called;
            expect(accountPassword.Model.remove).to.have.been.called;
            accountModel.create.restore();
            accountModel.remove.restore();
            accountPassword.Model.create.restore();
            accountPassword.Model.remove.restore();
            done();
          });
        });
      });

      context('when create newAccount and not user', () => {
        it('Shoud return null and execute the remove of account and not execute remove of user', (done) => {
          accountPassword.Model.create = () => {};
          sinon.stub(accountModel, 'create', () => ({ _id: '123456' }) );
          sinon.stub(accountModel, 'remove', () => Promise.resolve(sinon.spy()) );
          sinon.stub(accountPassword.Model, 'remove', () => Promise.resolve(sinon.spy()) );
          sinon.stub(accountPassword.Model, 'create', () => { throw new Error(); });

          account.onAfterCreateCallback = () => {
            throw new Error();
          };

          const email = 'graphite@graphite.com';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.be.null;

            expect(accountModel.remove).to.have.been.called;
            expect(accountPassword.Model.remove).to.have.not.been.called;
            accountModel.create.restore();
            accountModel.remove.restore();
            accountPassword.Model.remove.restore();
            done();
          });
        });
      });
    });
  });

  context('when loginPassword', () => {
    context('when password is valid', () => {
      it('Shoud contains key loginToken, loginTokenExpires and userId', (done) => {
        sinon.stub(accountPassword.Model, 'findOne', () => ({ userId: '123456', password: '123456' }) );
        const email = 'graphite@graphite.com';
        const password = '12346';
        sinon.stub(accountPassword, 'comparePassword', () =>  true);
        const loginPasswordPromise = accountPassword.loginPassword({}, { email, password });
        loginPasswordPromise.then(result => {
          expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
          accountPassword.Model.findOne.restore();
          done();
        });
      });
    });

    context('when password is invalid', () => {
      it('Shoud return null', (done) => {
        sinon.stub(accountPassword.Model, 'findOne', () => ({ userId: '123456', password: '123456' }) );
        const email = 'graphite@graphite.com';
        const password = '12346';
        sinon.stub(accountPassword, 'comparePassword', () =>  false);
        const loginPasswordPromise = accountPassword.loginPassword({}, { email, password });
        loginPasswordPromise.then(result => {
          expect(result).to.be.null;
          accountPassword.Model.findOne.restore();
          done();
        });
      });
    });

    context('when thow error', () => {
      it('Shoud return null', (done) => {
        sinon.stub(accountPassword.Model, 'findOne', () => { throw new Error(); } );
        const email = 'graphite@graphite.com';
        const password = '12346';
        sinon.stub(accountPassword, 'comparePassword', () =>  false);
        const loginPasswordPromise = accountPassword.loginPassword({}, { email, password });
        loginPasswordPromise.then(result => {
          expect(result).to.be.null;
          accountPassword.Model.findOne.restore();
          done();
        });
      });
    });
  });

  context('when changePassword', () => {
    context('when there are userId', () => {
      context('when oldPassword is equal to current password', () => {
        it('Shoud contains key loginToken, loginTokenExpires and userId', (done) => {
          sinon.stub(accountPassword.Model, 'findOne', () => ({ userId: '123456', password: '123456' }) );
          sinon.stub(accountPassword.Model, 'findOneAndUpdate', () =>  ({ userId: '123456', password: '111111' }));
          sinon.stub(accountPassword, 'comparePassword', () =>  true);

          const oldPassword = '123456';
          const newPassword = '111111';
          const userId = '123';
          const changePasswordPromise = accountPassword.changePassword({}, { oldPassword, newPassword }, { userId });
          changePasswordPromise.then(result => {
            expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
            accountPassword.Model.findOne.restore();
            accountPassword.Model.findOneAndUpdate.restore();
            accountPassword.comparePassword.restore();
            done();
          });
        });
      });

      context('when oldPassword is not equal to current password', () => {
        it('should return null', (done) => {
          sinon.stub(accountPassword.Model, 'findOne', () => ({ userId: '123456', password: '123456' }) );
          sinon.stub(accountPassword.Model, 'findOneAndUpdate', () =>  ({ userId: '123456', password: '111111' }));
          sinon.stub(accountPassword, 'comparePassword', () =>  false);
          const oldPassword = '222222';
          const newPassword = '111111';
          const userId = '123';
          const changePasswordPromise = accountPassword.changePassword({}, { oldPassword, newPassword }, { userId });
          changePasswordPromise.then(result => {
            expect(result).to.be.null;
            accountPassword.Model.findOne.restore();
            accountPassword.Model.findOneAndUpdate.restore();
            accountPassword.comparePassword.restore();
            done();
          });
        });
      });

      context('when oldPassword is not equal to current password', () => {
        it('should return null', (done) => {
          sinon.stub(accountPassword.Model, 'findOne', () => ({ userId: '123456', password: '123456' }) );
          sinon.stub(accountPassword.Model, 'findOneAndUpdate', () =>  undefined);
          sinon.stub(accountPassword, 'comparePassword', () =>  false);
          const oldPassword = '222222';
          const newPassword = '111111';
          const userId = '123';
          const changePasswordPromise = accountPassword.changePassword({}, { oldPassword, newPassword }, { userId });
          changePasswordPromise.then(result => {
            expect(result).to.be.null;
            accountPassword.Model.findOne.restore();
            accountPassword.Model.findOneAndUpdate.restore();
            accountPassword.comparePassword.restore();
            done();
          });
        });
      });
    });

    context('when not there are userId', () => {
      it('should return null', (done) => {
        const oldPassword = '222222';
        const newPassword = '111111';
        const userId = undefined;
        const changePasswordPromise = accountPassword.changePassword({}, { oldPassword, newPassword }, { userId });
        changePasswordPromise.then(result => {
          expect(result).to.be.null;
          done();
        });
      });
    });

    context('when throw error', () => {
      it('should return null', (done) => {
        const oldPassword = '222222';
        const newPassword = '111111';
        const userId = '123456';
        sinon.stub(accountPassword.Model, 'findOne', () => { throw new Error(); });

        const changePasswordPromise = accountPassword.changePassword({}, { oldPassword, newPassword }, { userId });
        changePasswordPromise.then(result => {
          expect(result).to.be.null;
          accountPassword.Model.findOne.restore();
          done();
        });
      });
    });
  });
});
