import { Component } from 'react';
import PropTypes from 'prop-types';
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
        <div className="studentsListContainer">
          <style jsx>{`
            .studentsListContainer {
              height: 180px;
              overflow-x: scroll;
              background: #f1f1f1;
            }
          `}</style>
          <List items= {items} />
        </div>
      </div>
    );
  }
}

const options = { pollInterval: 300 };
export default graphql(all, { options })(StudentList);
