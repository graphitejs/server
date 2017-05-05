import { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Nav from './Nav';


export default class Layout extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.object,
    ]),
    items: PropTypes.array,
    model: PropTypes.string,
  }

  static defaultProps = {
    items: [],
  }

  constructor() {
    super();
  }

  render() {
    const { items, children, model } = this.props;
    return (
      <div>
        <Header />
        <Nav items={items} model={model}/>
        <section className="layout">
          {children}
        </section>
      </div>
    );
  }
}
