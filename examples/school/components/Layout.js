import { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Nav from './Nav';
import withData from '../lib/withData';

class Layout extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.object,
    ]),
    items: PropTypes.array,
  }

  static defaultProps = {
    items: [],
  }

  constructor() {
    super();
  }

  render() {
    const { items, children } = this.props;
    return (
      <div>
        <style jsx>{`
          section {
            float: left;
            width: calc(100% - 200px);
          }
        `}
        </style>
        <Header />
        <Nav items={items} />
        <section>
          {children}
        </section>
      </div>
    );
  }
}

export default withData(Layout);
