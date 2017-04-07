import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
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
    it('Should be execute this.Model.find', () => {
      const result = accountPassword.findAccount("123");
      expect(accountPassword.Model.findOne).to.have.been.called;
    });
  });
});
