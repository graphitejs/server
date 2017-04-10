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
      create: () => ({
        userId: '123456',
      }),
      find: sinon.spy(),
      findOne: sinon.spy(),
    };
  });

  context('when execute accountPassword', () => {
    it('Should be execute this.Model.find', (done) => {
      accountPassword.accountPassword();
      expect(accountPassword.Model.find).to.have.been.called;
      done();
    });
  });

  context('when execute findAccount', () => {
    it('Should be execute this.Model.find', (done) => {
      accountPassword.findAccount('123');
      expect(accountPassword.Model.findOne).to.have.been.called;
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
          sinon.stub(accountModel, 'create', () => {
            return { _id: '123456' };
          });

          account.onBeforeCreateCallback = () => ({ password: '12345' });
          sinon.stub(account, 'onBeforeCreateCallback', () => ({ password: '12345' }) );

          account.onAfterCreateCallback = () => ({});
          sinon.stub(account, 'onAfterCreateCallback', () => ({}) );

          const email = 'graphite@graphite.com';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
            expect(account.onBeforeCreateCallback).to.have.been.called;
            expect(account.onAfterCreateCallback).to.have.been.called;
            accountModel.create.restore();
            account.onBeforeCreateCallback.restore();
            account.onAfterCreateCallback.restore();
            done();
          });
        });
      });

      context('when not has onBeforeCreateCallback and onAfterCreateCallback', () => {
        it('Shoud contains key loginToken, loginTokenExpires and userId and not execute onBeforeCreateCallback and onAfterCreateCallback', (done) => {
          sinon.stub(accountModel, 'create', () => {
            return { _id: '123456' };
          });

          account.onBeforeCreateCallback = undefined;
          account.onAfterCreateCallback = undefined;
          accountPassword.logger = sinon.spy();

          const email = 'graphite@graphite.com';
          const password = '12346';
          const createUserPromise = accountPassword.createUser({}, { email, password });
          createUserPromise.then(result => {
            expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
            expect(accountPassword.logger).to.have.not.been.calledWith('beforeCreate');
            expect(accountPassword.logger).to.have.not.been.calledWith('onAfterCreateCallback');
            accountModel.create.restore();
            done();
          });
        });
      });
    });

    context('when email is invalid', () => {
      it('Shoud return null', (done) => {
        sinon.stub(accountModel, 'create', () => {
          return { _id: '123456' };
        });

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
  });

  context('when loginPassword', () => {
    context('when password is valid', () => {

    });

    context('when password is invalid', () => {

    });
  });
});
