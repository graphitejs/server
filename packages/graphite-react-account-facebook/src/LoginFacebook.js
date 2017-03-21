import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Account from 'graphite-account';
import debug from 'debug';

class LoginFacebook extends Component {
  logger = debug('react-account-facebook');

  static propTypes = {
    mutate: PropTypes.func,
    textButton: PropTypes.string,
    textPopup: PropTypes.string,
  }

  static defaultProps = {
    textButton: 'Facebook',
    textPopup: 'Logging with facebook...',
  }

  constructor(props) {
    super(props);
    const loginToken = localStorage.getItem('Graphite.loginToken');
    const loginTokenExpires = localStorage.getItem('Graphite.loginTokenExpires');
    const userId = localStorage.getItem('Graphite.userId');
    const isLoggedIn = userId ? true : false;

    this.state = {
      url: '',
      isLoggedIn,
      loginToken,
      loginTokenExpires,
      userId,
    };

    window.addEventListener('storage', this.onChangeStorage.bind(this), false);
    window.addEventListener('loggedIn', this.loggedIn.bind(this), false);
    window.addEventListener('logout', this.logout.bind(this), false);
  }

  onChangeStorage(storageEvent) {
    const values = storageEvent.storageArea || {};
    const loginToken = values['Graphite.loginToken'];
    const loginTokenExpires = values['Graphite.loginTokenExpires'];
    const userId = values['Graphite.userId'];
    if (userId) {
      Account.loggedIn(loginToken, loginTokenExpires, userId);
    } else {
      Account.logout();
    }
  }

  render() {
    const { isLoggedIn } = this.state;
    const { textButton } = this.props;
    const buttonFacebook = isLoggedIn ? null : (<button onClick={this.createAccount.bind(this)}> {textButton} </button>);

    return (
      <div id= "LoginFacebook"> { buttonFacebook } </div>
    );
  }

  openPopup(url, height, width) {
    const screenX = !!window.screenX ? window.screenX : window.screenLeft;
    const screenY = !!window.screenY ? window.screenY : window.screenTop;
    const outerWidth = !!window.outerWidth ? window.outerWidth : document.body.clientWidth;
    const outerHeight = !!window.outerHeight ? window.outerHeight : (document.body.clientHeight - 22);
    const left = screenX + (outerWidth - width) / 2;
    const top = screenY + (outerHeight - height) / 2;
    const features = (`width= ${width} height= ${height} left= ${left} top= ${top} scrollbars=yes target='_blank'`);
    return window.open(url, 'Login', features);
  }

  async createAccount(event) {
    event.preventDefault();
    const { textPopup } = this.props;

    try {
      const popup = this.openPopup('', 600, 650);
      popup.document.write(textPopup);
      const result = await this.props.mutate();
      const url = result.data.loginFacebook.url;
      popup.location.replace(url);
    } catch (e) {
      logger(e);
    }
  }

  logout() {
    this.setState({ isLoggedIn: false, loginToken: '', loginTokenExpires: '', userId: '' });
  }

  loggedIn({ detail }) {
    const { loginToken, loginTokenExpires, userId } = detail;
    this.setState({ isLoggedIn: true, loginToken, loginTokenExpires, userId });
  }
}

export default graphql(gql`
  mutation loginFacebook {
    loginFacebook {
      url
    }
  }
`)(LoginFacebook);
