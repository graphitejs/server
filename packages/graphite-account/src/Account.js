import debug from 'debug';
const logger = debug('Account');

class Account {
  loggedIn(loginToken, loginTokenExpires, userId) {
    try {
      logger('Init loggedIn');
      logger(`loginToken: ${loginToken} - loginTokenExpires: ${loginTokenExpires} - userId: ${userId}`);
      localStorage.setItem('Graphite.loginToken', loginToken);
      localStorage.setItem('Graphite.loginTokenExpires', loginTokenExpires);
      localStorage.setItem('Graphite.userId', userId);
      logger('Save in localStorage');
      const event = new CustomEvent('loggedIn', { detail: { loginToken, loginTokenExpires, userId } });
      window.dispatchEvent(event);
      logger('Trigger event');
    } catch (e) {
      logger('Error loggedIn: ', e);
    }
  }

  logout() {
    try {
      logger('Init logout');
      localStorage.removeItem('Graphite.loginToken');
      localStorage.removeItem('Graphite.userId');
      localStorage.removeItem('Graphite.loginTokenExpires');
      logger('Remove in localStorage');
      const event = new Event('logout');
      window.dispatchEvent(event);
      logger('Trigger event');
    } catch (e) {
      logger('Error logout: ', e);
    }
  }
}

export default new Account();
