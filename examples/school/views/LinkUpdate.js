import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';

export default class LinkUpdate extends Component {
  static propTypes = {
    item: PropTypes.object,
  }

  constructor() {
    super();
  }

  render() {
    const { item: { _id }, model } = this.props;
    return (
      <div>
        <style jsx>{`
          div {
            display: inline-block;
            padding: 0 5px;
          }

          button {
            cursor: pointer;
          }
        `}</style>

        <Link as={`/${pluralize(model, 1)}/${_id}`} href= {{ pathname: '/Update', query: { model: pluralize(model, 2), id: _id } }}>
          <button>Edit</button>
        </Link>
      </div>
    );
  }
}
