import { mongoose } from '@graphite/mongoose';
import { graphQl, query } from '@graphite/decorators';
import jwt from 'jsonwebtoken';
import debug from 'debug';

@mongoose
@graphQl
class Account {
  logger = debug('mongoose-account');

  @query()
  accounts() {
    return this.Model.find();
  }

  JwSToken = { SECRET: 'Graphite', EXPIRES_IN: 10000 };

  constructor() {
    this.logger('Init accounts.');
  }

  setConfig(JwSToken) {
    this.JwSToken = JwSToken;
    this.logger(`JwSToken - SECRET: ${JwSToken.SECRET} - EXPIRES_IN:  ${JwSToken.EXPIRES_IN}`);
  }

  initialize(app) {
    app.use(this.verifyToken(jwt).bind(this));
  }

  verifyToken(jsonwebtoken) {
    return (req, res, next) => {
      const { JwSToken } = this;
      try {
        const { token } = req.headers;
        req.userId = jsonwebtoken.verify(token, JwSToken.SECRET)._doc.userId;
      } catch (error) {
        req.userId = undefined;
      }
      next();
    };
  }

  onBeforeCreate(callback) {
    if (this.onBeforeCreateCallback) {
      throw new Error('Can only call onBeforeCreate once');
    }

    if (typeof callback === 'function') {
      this.onBeforeCreateCallback = callback;
    }
  }

  onAfterCreate(callback) {
    if (this.onAfterCreateCallback) {
      throw new Error('Can only call onAfterCreate once');
    }

    if (typeof callback === 'function') {
      this.onAfterCreateCallback = callback;
    }
  }
}

export default new Account();
