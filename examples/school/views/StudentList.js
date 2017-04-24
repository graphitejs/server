import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Table from '../components/Table';

import { all } from '../graphql/students';

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

    const studentTable = !loading && !error ? (
      <Table items= {students} omit={['__typename', 'active']} />
    ) : null;

    return (
      <div>
        <h2>List of students</h2>
        {studentTable}
      </div>
    );
  }
}

const options = { pollInterval: 300 };
export default graphql(all, { options })(StudentList);
