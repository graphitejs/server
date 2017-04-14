import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
import jwt from 'jsonwebtoken';

import account from '../src/account';

describe('Mongoose account', () => {
  beforeEach(() => {
    account.Model = {
      create: () => {},
      find: () => {},
      findOne: () => {},
      remove: () => {},
      findOneAndUpdate: () => {},
    };
  });

  context('when accounts', () => {
    it('Should be execute this.Model.find', () => {
      sinon.spy(account.Model, 'find');
      account.accounts();
      expect(account.Model.find).to.have.been.called;
      account.Model.find.restore();
    });
  });

  context('setConfig', () => {
    it('Should set JwSToken', () => {
      account.setConfig('123456');
      expect(account.JwSToken).eql('123456');
    });
  });

  context('when initialize', () => {
    it('Should execute app.use', (done) => {
      const app = {
        use: sinon.spy(),
      };

      sinon.stub(account, 'verifyToken', () => { return () => {}; });

      account.initialize(app);
      expect(app.use).to.have.been.called;
      account.verifyToken.restore();
      done();
    });
  });

  context('when verifyToken', () => {
    context('when success', () => {
      it('should req has userId', (done) => {
        const jsonwebtoken = {
          verify: () => ({ _doc: { userId: '123456' }}),
        };

        const req = {
          headers: {
            token: '123456',
          },
        };

        const res = {};
        const next = sinon.spy();

        const callback = account.verifyToken(jsonwebtoken);
        callback(req, res, next);
        expect(req.userId).eql('123456');
        expect(next).to.have.been.called;
        done();
      });
    });

    context('when failed', () => {
      it('should req has userId with undefined', (done) => {
        const jsonwebtoken = {
          verify: () => ({}),
        };

        const req = {
          headers: {
            token: '123456',
          },
        };

        const res = {};
        const next = sinon.spy();

        const callback = account.verifyToken(jsonwebtoken);
        callback(req, res, next);
        expect(req.userId).to.be.undefined;
        expect(next).to.have.been.called;
        done();
      });
    });
  });

  context('when onBeforeCreate', () => {
    context('when not exists onBeforeCreate with default value', () => {
      it('Should assign function onBeforeCreate', () => {
        account.onBeforeCreate();
        expect(account.onBeforeCreateCallback).to.be.function;
      });
    });

    context('when not exists onBeforeCreate with value', () => {
      it('Should assign function onBeforeCreate', () => {
        account.onBeforeCreateCallback = undefined;
        account.onBeforeCreate(() => {});
        expect(account.onBeforeCreateCallback).to.be.function;
      });
    });

    context('when exists onBeforeCreate', () => {
      it('Should throw error', () => {
        account.onBeforeCreateCallback = () => {};
        try {
          account.onBeforeCreate();
        } catch (error) {
          expect(error.message).eql('Can only call onBeforeCreate once');
        }
      });
    });
  });

  context('when onAfterCreate', () => {
    context('when not exists onAfterCreate with default value', () => {
      it('Should assign function onAfterCreate', () => {
        account.onAfterCreate();
        expect(account.onAfterCreateCallback).to.be.function;
      });
    });

    context('when not exists onAfterCreate with value', () => {
      it('Should assign function onAfterCreate', () => {
        account.onAfterCreateCallback = undefined;
        account.onAfterCreate(() => {});
        expect(account.onAfterCreateCallback).to.be.function;
      });
    });

    context('when exists onAfterCreate', () => {
      it('Should throw error', () => {
        account.onAfterCreateCallback = () => {};
        try {
          account.onAfterCreate();
        } catch (error) {
          expect(error.message).eql('Can only call onAfterCreate once');
        }
      });
    });
  });
});
