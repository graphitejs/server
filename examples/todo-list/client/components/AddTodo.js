import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export class AddTodo extends Component {

  static propTypes = {
    mutate: PropTypes.func,
  }

  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
      success: undefined,
      showMessage: false,
    };
  }

  async onSubmit(event) {
    try {
      event.preventDefault();
      const { addTaskInput } = this.refs;
      const newTodo = {
        name: addTaskInput.value,
        status: false,
      };

      const { data } = await this.props.mutate({ variables: { newTodo } });
      if (data) {
        this.setState({ showMessage: true, success: true });
        setTimeout(() => {
          this.setState({ showMessage: false, success: undefined });
        }, 2000);
      }
    } catch (error) {
      this.setState({ showMessage: true, success: false });
      setTimeout(() => {
        this.setState({ showMessage: false, success: undefined });
      }, 2000);
    }
  }

  render() {
    const { success, showMessage } = this.state;
    return (
      <div>
        { success && showMessage ? (<div>Success</div>) : null }
        { !success && showMessage ? (<div>Fail</div>) : null }
        <form onSubmit= { this.onSubmit.bind(this) }>
          <input ref="addTaskInput" type= "text" placeholder= "Add task" />
          <button> Add todo </button>
        </form>
      </div>
    );
  }
}

export default graphql(gql `
  mutation createTodo($newTodo: createTodo) {
  createTodo(todo: $newTodo) {
    todo {
      _id
      name
      status
    }
    errors {
      key
      message
    }
  }
}
`)(AddTodo);
