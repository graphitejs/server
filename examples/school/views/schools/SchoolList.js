import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Table from '../../components/Table';
import SchoolActions from './SchoolActions';
import { all } from '../../graphql/schools';

export class SchoolList extends Component {
  static propTypes = {
    mutate: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.boolean,
      error: PropTypes.object,
    }),
  }

  static defaultProps = {
    loading: true,
    data: {
      schools: [],
    },
  }

  constructor() {
    super();
  }

  render() {
    const { data: { loading, error, schools } } = this.props;

    const actions = {
      name: 'Actions',
      elements: (<SchoolActions />),
    };

    const schoolTable = !loading && !error ? (
      <Table items= {schools} actions={actions} omit={['__typename', 'active']} />
    ) : null;

    return (
      <div>
        <style jsx>{`
          h2 {
            float: left;
          }
          a {
            float: right;
            padding: 30px;
          }
        `}
        </style>
        <div>
          <h2>Schools</h2>
          <Link href="/school/create">
            <a>Add school</a>
          </Link>
        </div>
        {schoolTable}
      </div>
    );
  }
}

const options = { pollInterval: 300 };
export default graphql(all, { options })(SchoolList);
