import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Table from '../../components/Table';
import StudentActions from './StudentActions';
import { all } from '../../graphql/students';

export class StudentList extends Component {
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
      students: [],
    },
  }

  constructor() {
    super();
  }

  render() {
    const { data: { loading, error, students } } = this.props;

    const actions = {
      name: 'Actions',
      elements: (<StudentActions />),
    };

    const studentTable = !loading && !error ? (
      <Table items= {students} actions={actions} omit={['__typename', 'active']} />
    ) : null;

    return (
      <div>
        <div className="layout-header">
          <h2 className="main">Students</h2>
        </div>
        {studentTable}
        <Link href="/student/create">
          <div className="btn-round">
            <span>+</span>
          </div>
        </Link>
      </div>
    );
  }
}

const options = { pollInterval: 300 };
export default graphql(all, { options })(StudentList);
