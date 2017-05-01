import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

export default class List extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.any.isRequired,
      href: PropTypes.any.isRequired,
    })),
  }

  static defaultProps = {
    items: [],
  }

  constructor() {
    super();

    this.state = {
      pathname: '',
    };
  }

  componentDidMount() {
    let pathname = Router.pathname;
    if (pathname === '/') pathname = '/home'

    this.setState({ pathname });
  }

  render() {
    const { items } = this.props;

    return (
      <nav className="nav">
        <Link href="/">
          <a className={this.linkClassNames({href: '/home'})}>Home</a>
        </Link>
        <Link href="/about">
          <a className={this.linkClassNames({href: '/about'})}>About</a>
        </Link>

        <div className="nav-model-container">
          {items.map((item, key) => {
            return (
              <Link key= { key } href= {item.href}>
                <a className={this.linkClassNames(item)}>
                  {item.name}
                </a>
              </Link> );
          })}
        </div>
      </nav>
    );
  }

  linkClassNames(item) {
    const classes = ['nav-link'];
    const pathname = this.state.pathname;

    if ( pathname.match(item.href) ) classes.push('active');
    return classes.join(' ');
  }
}
