import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { createTodo } from '../graphql/todo';

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
        addTaskInput.value = '';
        setTimeout(() => {
          this.setState({ showMessage: false, success: undefined });
        }, 1000);
      }
    } catch (error) {
      this.setState({ showMessage: true, success: false });
      setTimeout(() => {
        this.setState({ showMessage: false, success: undefined });
      }, 1000);
    }
  }

  render() {
    const { success, showMessage } = this.state;
    const successStatus = success && showMessage ? 'success' : '';
    const failStatus = !success && showMessage ? 'fail' : '';
    return (
      <div id= "add-todo">
        <form onSubmit= { this.onSubmit.bind(this) }>
          <input className= { successStatus + failStatus } ref="addTaskInput" type= "text" placeholder= "Add task" />
          <button> Add </button>
        </form>
      </div>
    );
  }
}

export default graphql(createTodo)(AddTodo);
