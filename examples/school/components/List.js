import { Component, PropTypes } from 'react';
import identity from 'lodash/identity';

export default class List extends Component {
  render() {
    const { items, onClick } = this.props;

    return (
      <ul>
        {items.map((item, key) => {
          return <li key = { key } onClick = { onClick.bind(this, item) } > { item.label } </li>;
        })}
      </ul>
    );
  }
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  })),
  onClick: PropTypes.func,
};

List.defaultProps = {
  items: [{ value: '', label: 'Empty list'}],
  onClick: identity,
};
