import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
import account from '../src/Account';

describe('Accounts', () => {
  global.localStorage = {
    removeItem: sinon.spy(),
    setItem: sinon.spy(),
  };

  global.window = {
    dispatchEvent: sinon.spy(),
  };

  global.CustomEvent = sinon.spy();
  global.Event = sinon.spy();
  account.logger = sinon.spy();

  context('when loggedIn', () => {
    context('when success', () => {
      it('Should set item in localStorage and execute dispatchEvent', () => {
        const loginToken = '123456';
        const loginTokenExpires = 0;
        const userId = '123456';

        account.loggedIn(loginToken, loginTokenExpires, userId);
        expect(localStorage.setItem).to.have.been.calledWith('Graphite.loginToken', loginToken);
        expect(localStorage.setItem).to.have.been.calledWith('Graphite.loginTokenExpires', loginTokenExpires);
        expect(localStorage.setItem).to.have.been.calledWith('Graphite.userId', userId);
        expect(CustomEvent).to.have.been.calledWith('loggedIn',  { detail: { loginToken, loginTokenExpires, userId } });
        expect(window.dispatchEvent).to.have.been.called;
      });
    });

    context('when failed', () => {
      it('Should execute logger with error message', () => {
        const loginToken = '123456';
        const loginTokenExpires = 0;
        const userId = '123456';
        const error = 'Error';
        localStorage.setItem = () => {};
        sinon.stub(localStorage, 'setItem', () => { throw new Error(error); });

        account.loggedIn(loginToken, loginTokenExpires, userId);

        expect(account.logger).to.have.been.calledWith(`Error loggedIn: ${error}`);
      });
    });
  });

  context('when logout', () => {
    context('when success', () => {
      it('Should remove item in localStorage and execute dispatchEvent', () => {
        account.logout();
        expect(localStorage.removeItem).to.have.been.calledWith('Graphite.loginToken');
        expect(localStorage.removeItem).to.have.been.calledWith('Graphite.loginTokenExpires');
        expect(localStorage.removeItem).to.have.been.calledWith('Graphite.userId');
        expect(Event).to.have.been.calledWith('logout');
        expect(window.dispatchEvent).to.have.been.called;
      });
    });

    context('when failed', () => {
      it('Should execute logger with error message', () => {
        const error = 'Error';
        localStorage.removeItem = () => {};
        sinon.stub(localStorage, 'removeItem', () => { throw new Error(error); });

        account.logout();

        expect(account.logger).to.have.been.calledWith(`Error logout: ${error}`);
      });
    });
  });
});
