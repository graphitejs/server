import { mongoose } from '@graphite/mongoose';
import { extendTypeGraphQl } from '@graphite/utils';
import account, { Model as accountModel } from '@graphite/mongoose-account';
import { property, graphQl, mutation, type, query } from '@graphite/decorators';
import { Facebook } from 'fb';
import jwt from 'jsonwebtoken';
import debug from 'debug';

@mongoose
@graphQl
export default class AccountFacebook {
  logger = debug('mongoose-account-facebook');

  @property('String | required | unique')
  userId;

  @property('String | required | unique')
  facebookId;

  @property('String | required')
  accessToken;

  @query()
  accountFacebook() {
    return this.Model.find();
  }

  saltRounds = 10;

  constructor(appId = '', secret = '', redirect = '') {
    this.logger('Init accountFacebook.');
    this.redirect = redirect;
    this.appId = appId;
    this.secret = secret;
    this.facebook = new Facebook({ appId, secret });

    const scope = 'email,user_likes';
    /* eslint-disable camelcase */
    const redirect_uri = this.redirect;
    this.url = this.facebook.getLoginUrl({ scope, redirect_uri });
    extendTypeGraphQl(account, 'accountFacebook: AccountFacebook', this.findAccount.bind(this));
  }

  async findAccount({ _id }) {
    return await this.Model.findOne({ userId: _id });
  }

  initialize(app) {
    app.get('/login/facebook', this.callbackFacebook.bind(this));
  }

  getAccessToken(appId, secret, code, redirect) {
    return new Promise((resolve, reject) => {
      this.facebook.napi('oauth/access_token', {
        client_id: appId,
        client_secret: secret,
        redirect_uri: redirect,
        code: code,
      }, function(error, result) {
        if (error) {
          reject(error);
        }

        resolve({ token: result.access_token, expires: result.expires ? result.expires : 0 });
      });
    });
  }

  getExtendAccessToken(appId, secret, token) {
    return new Promise((resolve, reject) => {
      this.facebook.napi('oauth/access_token', {
        client_id: appId,
        client_secret: secret,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: token,
      }, function(error, result) {
        if (error) {
          reject(error);
        }

        resolve({ token: result.access_token, expires: result.expires ? result.expires : 0 });
      });
    });
  }

  getMe(token) {
    return new Promise((resolve) => {
      const fields = [
        'id',
        'cover',
        'name',
        'first_name',
        'last_name',
        'age_range',
        'link',
        'gender',
        'locale',
        'picture',
        'timezone',
        'updated_time',
        'verified',
      ];
      this.facebook.api('me', { fields, access_token: token }, function(result) {
        resolve(result);
      });
    });
  }

  templateToken({ loginToken, userId, loginTokenExpires }) {
    return `
      <script>
        window.localStorage.setItem("Graphite.loginToken", "${loginToken}");
        window.localStorage.setItem("Graphite.userId", "${userId}");
        window.localStorage.setItem("Graphite.loginTokenExpires", "${loginTokenExpires}");

        if (window.opener) {
            window.opener.focus();
        }
        window.close();
      </script>
    `;
  }

  templateError() {
    return `
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
  }

  generateAppToken(user, JwSToken) {
    const { userId } = user;
    const loginToken = jwt.sign(user, JwSToken.SECRET, {
      expiresIn: JwSToken.EXPIRES_IN,
    });

    const decoded = jwt.verify(loginToken, JwSToken.SECRET);
    const loginTokenExpires = new Date(decoded.exp * 1000);

    return { loginToken, loginTokenExpires, userId };
  }

  async callbackFacebook(req, res) {
    let newAccount;
    let user;
    try {
      const code = req.query.code;
      if (req.query.error) {
        this.logger('Error with login');
        res.write(this.templateError());
        return;
      }

      const { JwSToken } = account;
      const result = await this.getAccessToken(this.appId, this.secret, code, this.redirect);
      this.logger('getAccessToken: ', result);
      const { token } = await this.getExtendAccessToken(this.appId, this.secret, result.token);
      const me = await this.getMe(token);
      this.logger('me: ', me);
      user = await this.Model.findOne({ facebookId: me.id });
      this.logger('user: ', user);

      if (user) {
        res.write(this.templateToken(this.generateAppToken(user, JwSToken)));
        return;
      }

      if (account.onBeforeCreateCallback) {
        account.onBeforeCreateCallback(me);
        this.logger('onBeforeCreateCallback');
      }

      newAccount = await accountModel.create({ type: 'facebook' });
      user = await this.Model.create({ userId: newAccount._id, facebookId: me.id, accessToken: token });

      if (account.onAfterCreateCallback) {
        account.onAfterCreateCallback(user);
        this.logger('onAfterCreateCallback');
      }

      res.write(this.templateToken(this.generateAppToken(user, JwSToken)));
    } catch (error) {
      if (newAccount) {
        await accountModel.remove({ _id: newAccount._id });
      }

      if (user) {
        await this.Model.remove({ _id: user._id });
      }

      this.logger(`Error callbackFacebook: ${error}`);
      res.write(this.templateError());
    }
  }

  @type
  authenticationFacebook() {
    return `
      url: String
    `;
  }

  @mutation({
    responseType: 'authenticationFacebook',
  })
  loginFacebook() {
    return { url: this.url };
  }
}
