import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class SchoolEdit extends Component {
  static propTypes = {
    item: PropTypes.object,
  }

  constructor() {
    super();
  }

  render() {
    const { item: { _id } } = this.props;
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

        <Link href={`/school/edit?id=${_id}`}>
          <button>Edit</button>
        </Link>
      </div>
    );
  }
}
