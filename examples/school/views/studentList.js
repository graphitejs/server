import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { studentList } from '../graphql/students';

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
      schools: [],
    },
  }

  constructor() {
    super();
  }

  render() {
    const { data: { loading, error, schools } } = this.props;
    const items = !loading && !error ? schools.map(school => ({ label: school.name, value: school.name })) : [];
    return (
      <List items= {items} />
    );
  }
}

export default graphql(studentList)(StudentList);
