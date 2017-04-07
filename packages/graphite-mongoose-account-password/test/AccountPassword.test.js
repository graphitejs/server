import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
import bcrypt from 'bcrypt';
import AccountPassword from '../src/AccountPassword';

describe('Mongoose Account Password', () => {
  let accountPassword;

  beforeEach(() => {
    accountPassword = new AccountPassword();
    accountPassword.Model = {
      find: sinon.spy(),
      findOne: sinon.spy()
    }
  });

  context('when execute accountPassword', () => {
    it('Should be execute this.Model.find', (done) => {
      const result = accountPassword.accountPassword();
      expect(accountPassword.Model.find).to.have.been.called;
      done();
    });
  });

  context('when execute findAccount', () => {
    it('Should be execute this.Model.find', (done) => {
      const result = accountPassword.findAccount("123");
      expect(accountPassword.Model.findOne).to.have.been.called;
      done();
    });
  });

  context('when comparePassword', () => {
    context('when the password is incorrect', () => {
      it('Should be return false', (done) => {
        const result = accountPassword.comparePassword("123456", "aaaaaaaaaaaa");
        expect(result).to.be.false;
        done();
      });
    });

    context('when the password is correct', () => {
      it('Should be return true', (done) => {
        bcrypt.hash("123456", 10, function(err, hash) {
          const result = accountPassword.comparePassword("123456", hash);
          expect(result).to.be.true;
          done();
        });
      });
    });
  });

  context('when formatCallback', () => {
    it('Should be return object with loginToken, loginTokenExpires and userId', (done) => {
      const user = { userId: '123456' };
      const SECRET = "SECRET";
      const EXPIRES_IN = 10000;

      const result = accountPassword.formatCallback(user, SECRET, EXPIRES_IN);
      expect(result).to.be.object;
      expect(result).to.include.keys('loginToken', 'loginTokenExpires', 'userId');
      done();
    });
  });
});
