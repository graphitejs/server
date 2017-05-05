import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import pluralize from 'pluralize';

export default class Nav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.any.isRequired,
      href: PropTypes.any.isRequired,
    })),
    model: PropTypes.string,
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
    const pathname = Router.pathname.toLowerCase();
    this.setState({ pathname });
  }

  render() {
    const { items } = this.props;

    return (
      <nav className="nav">
        <div className="admin">
          <div className="admin-top"/>
          <div className="admin-bottom"/>
          <div className="admin-img-container">
            <img/>
          </div>
        </div>

        <Link as="/" href="/Index">
          <a className={this.linkClassNames({href: '/index'})}>Home</a>
        </Link>
        <Link as="/about" href="/About">
          <a className={this.linkClassNames({href: '/about'})}>About</a>
        </Link>

        <div className="nav-model-container">
          {items.map((item, key) => {
            return (
              <Link key= { key } as={`/${pluralize(item.name, 1)}`} href= {{ pathname: item.href, query: item.query}}>
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

    if (item.href === '/View' && item.query) {
      if (item.query.model === this.props.model) classes.push('active');
      return classes.join(' ');
    }

    if ( pathname.match(item.href) ) classes.push('active');
    return classes.join(' ');
  }
}
