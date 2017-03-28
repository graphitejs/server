import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export class TodoList extends Component {

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      todo: PropTypes.array,
    }).isRequired,
  }

  static defaultProps = {
    loading: true,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { data: { loading, error, todo } } = this.props;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error!</p>;
    }

    return (
      <ul>
        {todo.map(({ _id, name }) => (
          <li key={_id}>{name}</li>
        ))}
      </ul>
    );
  }
}

const todoList = gql `
  query todoList {
    todo {
      _id
      status
      name
    }
  }
`;

const options = { pollInterval: 1000 };
export default graphql(todoList, { options })(TodoList);
