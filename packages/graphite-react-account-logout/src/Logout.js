import React, { Component, PropTypes } from 'react';
import Account from '@graphite/account';

export default class Logout extends Component {

  static propTypes = {
    textButton: PropTypes.string,
  }

  static defaultProps = {
    textButton: 'Logout',
  }

  constructor(props) {
    super(props);
    const userId = localStorage.getItem('Graphite.userId');
    const isLoggedIn = userId ? true : false;

    this.state = {
      isLoggedIn,
    };

    window.addEventListener('loggedIn', this.loggedIn.bind(this), false);
  }

  render() {
    const { isLoggedIn } = this.state;
    const { textButton } = this.props;
    const buttonLogout = isLoggedIn ? (<button onClick={this.logout.bind(this)}> {textButton} </button>) : null;

    return (
      <div id= "Logout"> { buttonLogout } </div>
    );
  }

  loggedIn() {
    this.setState({ isLoggedIn: true });
  }

  logout() {
    this.setState({ isLoggedIn: false });
    Account.logout();
  }
}
