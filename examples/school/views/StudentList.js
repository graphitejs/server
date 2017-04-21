import { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import List from '../components/List';
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
    const items = !loading && !error ? students.map(school => ({ label: school.name, value: school.name })) : [];
    return (
      <div>
        <h2>List of students</h2>
        <List items= {items} />
      </div>
    );
  }
}

const options = { pollInterval: 300 };
export default graphql(all, { options })(StudentList);
