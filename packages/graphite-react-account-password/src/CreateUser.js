import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Account from '@graphite/account';
import debug from 'debug';

export class CreateUser extends Component {
  logger = debug('react-account-password');

  static propTypes = {
    mutate: PropTypes.func,
    emailInputPlaceholder: PropTypes.string,
    passwordInputPlaceholder: PropTypes.string,
    buttonSubmitText: PropTypes.string,
    legendtext: PropTypes.string,
  }

  static defaultProps = {
    emailInputPlaceholder: 'Please, enter your email',
    passwordInputPlaceholder: 'Please, enter your password',
    buttonSubmitText: 'Create user',
    legendtext: 'Create user',
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

    window.addEventListener('loggedIn', this.loggedIn.bind(this), false);
    window.addEventListener('logout', this.logout.bind(this), false);
  }

  async onSubmit(event) {
    try {
      event.preventDefault();
      const { emailInput, passwordInput } = this.refs;
      const email = emailInput.value;
      const password = passwordInput.value;
      const { data } = await this.props.mutate({ variables: { email, password } });
      if (data.createUser) {
        const { loginToken, loginTokenExpires, userId } = data.createUser;
        Account.loggedIn(loginToken, loginTokenExpires, userId);
        this.setState({ isLoggedIn: true, loginToken, loginTokenExpires, userId });
      }
    } catch (e) {
      this.logger(e);
    }
  }

  render() {
    const { emailInputPlaceholder, passwordInputPlaceholder, buttonSubmitText, legendtext } = this.props;
    const { isLoggedIn } = this.state;

    const legend = (
      <legend> {legendtext} </legend>
    );

    const emailInput = (
      <input ref= "emailInput" type= "text" placeholder= {emailInputPlaceholder} />
    );

    const passwordInput = (
      <input ref= "passwordInput" type= "password" placeholder= {passwordInputPlaceholder} />
    );

    const buttonSubmit = (
      <button> {buttonSubmitText} </button>
    );

    const form = isLoggedIn ? null : (
      <form onSubmit={this.onSubmit.bind(this)}>
        <fieldset>
          {legend}
          {emailInput}
          {passwordInput}
          {buttonSubmit}
        </fieldset>
      </form>
    );

    return (
      <div id= "CreateUser"> {form} </div>
    );
  }

  logout() {
    this.setState({ isLoggedIn: false, loginToken: '', loginTokenExpires: '', userId: '' });
  }

  loggedIn({ detail }) {
    const { loginToken, loginTokenExpires, userId } = detail;
    this.setState({ isLoggedIn: true, loginToken, loginTokenExpires, userId });
  }
}

export default graphql(gql `
  mutation createUser($email: String, $password: String) {
    createUser(email: $email, password: $password) {
      loginToken
      userId
      loginTokenExpires
    }
  }
`)(CreateUser);
