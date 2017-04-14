import debug from 'debug';

class Account {
  logger = debug('Account');

  loggedIn(loginToken, loginTokenExpires, userId) {
    try {
      this.logger('Init loggedIn');
      this.logger(`loginToken: ${loginToken} - loginTokenExpires: ${loginTokenExpires} - userId: ${userId}`);
      localStorage.setItem('Graphite.loginToken', loginToken);
      localStorage.setItem('Graphite.loginTokenExpires', loginTokenExpires);
      localStorage.setItem('Graphite.userId', userId);
      this.logger('Save in localStorage');
      const event = new CustomEvent('loggedIn', { detail: { loginToken, loginTokenExpires, userId } });
      window.dispatchEvent(event);
      this.logger('Trigger event');
    } catch (error) {
      this.logger(`Error loggedIn: ${error.message}`);
    }
  }

  logout() {
    try {
      this.logger('Init logout');
      localStorage.removeItem('Graphite.loginToken');
      localStorage.removeItem('Graphite.userId');
      localStorage.removeItem('Graphite.loginTokenExpires');
      this.logger('Remove in localStorage');
      const event = new Event('logout');
      window.dispatchEvent(event);
      this.logger('Trigger event');
    } catch (error) {
      this.logger(`Error logout: ${error.message}`);
    }
  }
}

export default new Account();
