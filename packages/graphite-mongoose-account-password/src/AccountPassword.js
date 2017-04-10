import { mongoose } from '@graphite/mongoose';
import { extendTypeGraphQl } from '@graphite/utils';
import account, { Model as accountModel } from '@graphite/mongoose-account';
import { property, graphQl, mutation, type, query } from '@graphite/decorators';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import debug from 'debug';

@mongoose
@graphQl
export default class AccountPassword {
  logger = debug('mongoose-account-password');

  @property('String | required | unique')
  userId;

  @property('String | required | unique')
  email;

  @property('String | required')
  password;

  @property('Boolean')
  verifiedEmail = false;

  @query()
  accountPassword() {
    return this.Model.find();
  }

  saltRounds = 10;
  pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor() {
    this.logger('Init accounts.');
    extendTypeGraphQl(account, 'accountPassword: AccountPassword', this.findAccount.bind(this));
  }

  async findAccount({ _id }) {
    return await this.Model.findOne({ userId: _id });
  }

  comparePassword(pw, hash) {
    return bcrypt.compareSync(pw, hash);
  }

  formatCallback(user, SECRET, EXPIRES_IN) {
    const loginToken = jwt.sign(user, SECRET, {
      expiresIn: EXPIRES_IN,
    });
    const decoded = jwt.verify(loginToken, SECRET);
    const loginTokenExpires = new Date(decoded.exp * 1000);
    const { userId } = user;
    return { loginToken, loginTokenExpires, userId };
  }

  @type
  authenticationPassword() {
    return `
      loginToken: String,
      userId: String,
      loginTokenExpires: String
    `;
  }

  @mutation({
    fields: 'email: String, password: String',
    responseType: 'authenticationPassword',
  })
  async createUser(_, { email, password }) {
    let newAccount;
    let user;
    try {
      this.logger('Init createUser');
      this.logger(`Parameters, email: ${email} - password: ${password}`);

      if (this.pattern.test(email)) {
        this.logger(`Email ${email} is valid`);
        const { SECRET, EXPIRES_IN } = account.JwSToken;
        this.logger(`JwSToken - SECRET: ${SECRET} - EXPIRES_IN: ${EXPIRES_IN}`);
        let beforeCreate = { email, password };

        if (account.onBeforeCreateCallback) {
          beforeCreate = account.onBeforeCreateCallback({ email, password });
          this.logger(`beforeCreate: ${JSON.stringify(beforeCreate)}`);
        }

        const hashPassword = await bcrypt.hash(beforeCreate.password, this.saltRounds);
        this.logger(`hashPassword: ${hashPassword}`);

        newAccount = await accountModel.create({ type: 'password' });
        user = await this.Model.create({ userId: newAccount._id, email, password: hashPassword });
        this.logger(`User created:  ${user}`);

        if (account.onAfterCreateCallback) {
          account.onAfterCreateCallback(user);
          this.logger('onAfterCreateCallback');
        }

        return this.formatCallback(user, SECRET, EXPIRES_IN);
      }

      this.logger('Finish createUser');
      return null;
    } catch (error) {
      if (newAccount) {
        await accountModel.remove({ _id: newAccount._id });
      }

      if (user) {
        await this.Model.remove({ _id: user._id });
      }
      this.logger(`Error createUser: ${error}`);
      return null;
    }
  }

  @mutation({
    fields: 'email: String, password: String',
    responseType: 'authenticationPassword',
  })
  async loginPassword(_, { email, password }) {
    try {
      this.logger('Init loginPassword');
      this.logger(`Parameters, email: ${email} - password: ${password}`);

      const { SECRET, EXPIRES_IN } = account.JwSToken;
      const user = await this.Model.findOne({ email });
      this.logger(`User ${user}`);
      const isMatch = await this.comparePassword(password, user.password);
      this.logger(`The password is ${ isMatch ? 'equal' : 'not equal'}`);

      if (isMatch) {
        return this.formatCallback(user, SECRET, EXPIRES_IN);
      }
      this.logger('Finish loginPassword');
      return null;
    } catch (error) {
      this.logger(`Error loginPassword: ${error}`);
      return null;
    }
  }

  @mutation({
    fields: 'oldPassword: String, newPassword: String',
    responseType: 'authenticationPassword',
  })
  async changePassword(_, { oldPassword, newPassword }, { userId }) {
    try {
      this.logger('Init changePassword');
      this.logger(`Parameters, oldPassword: ${oldPassword} - newPassword: ${newPassword} - userId: ${userId}`);
      if (typeof userId === 'undefined') {
        this.logger('Finish changePassword');
        return null;
      }

      const { SECRET, EXPIRES_IN } = account.JwSToken;
      let user = await this.Model.findOne({ userId });
      this.logger(`User ${user}`);
      const isMatch = await this.comparePassword(oldPassword, user.password);

      this.logger(`The password is ${ isMatch ? 'equal' : 'not equal'}`);
      if (isMatch) {
        const hashPassword = await bcrypt.hash(newPassword, this.saltRounds);
        this.logger(`hashPassword: ${hashPassword}`);
        user = await this.Model.findOneAndUpdate({ userId }, { $set: { password: hashPassword }});
        return this.formatCallback(user, SECRET, EXPIRES_IN);
      }
      this.logger('Finish changePassword');
      return null;
    } catch (error) {
      this.logger(`Error changePassword: ${error}`);
      return null;
    }
  }
}
