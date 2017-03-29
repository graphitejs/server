import React, { Component, PropTypes } from 'react';
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
      showErrorMessage: false,
      errorMessage: '',
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
      if (data.createTodo.todo) {
        addTaskInput.value = '';
        this.toggleNotification(true);
      }

      if (data.createTodo.errors) {
        const mapErrors = data.createTodo.errors.map(error => error.message);
        this.toggleNotification(false);
        this.toggleShowError(mapErrors.join('\n'));
      }
    } catch (error) {
      this.toggleNotification(false);
    }
  }

  render() {
    const { success, showMessage, showErrorMessage, errorMessage } = this.state;
    const successStatus = success && showMessage ? 'success' : '';
    const failStatus = !success && showMessage ? 'fail' : '';
    const contentError = showErrorMessage ? (
      <div id= "error-message"> {errorMessage} </div>
    ) : null;

    return (
      <div id= "add-todo">
        <form onSubmit= { this.onSubmit.bind(this) }>
          <input className= { successStatus + failStatus } ref="addTaskInput" type= "text" placeholder= "Add task" />
          <button> Add </button>
        </form>
        {contentError}
      </div>
    );
  }

  toggleNotification(status) {
    this.setState({ showMessage: true, success: status });
    setTimeout(() => {
      this.setState({ showMessage: false, success: undefined });
    }, 1000);
  }

  toggleShowError(message) {
    this.setState({ showErrorMessage: true, errorMessage: message });
    setTimeout(() => {
      this.setState({ showErrorMessage: false, errorMessage: '' });
    }, 1000);
  }
}

export default graphql(createTodo)(AddTodo);
