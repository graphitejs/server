import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import { todoList, updateTodo, removeTodo, options } from '../graphql/todo';


export class TodoList extends Component {

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      todo: PropTypes.array,
    }).isRequired,
    updateTodo: PropTypes.func,
    removeTodo: PropTypes.func,
  }

  static defaultProps = {
    loading: true,
  }

  constructor(props) {
    super(props);
  }

  async onChange(item, event) {
    try {
      event.preventDefault();
      const id = item._id;
      const updateTodo = {
        name: item.name,
        status: !item.status,
      };

      await this.props.updateTodo({ variables: { id, updateTodo } });
    } catch (error) {
      console.log("Error: ",error);
    }
  }

  async onRemove(id, event) {
    try {
      event.preventDefault();
      await this.props.removeTodo({ variables: { id } });
    } catch (error) {
      console.log("Error: ",error);
    }
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
      <ul id= "todo-list">
        {
          todo.map(item => (
            <li className={ item.status ? 'done' : '' }
                onClick= { this.onChange.bind(this, item) } key={item._id}>{item.name}
                <span className={ item.status ? 'done' : 'hidden' }> &#10004; </span>
                <button className = {'reset delete'} onClick= {this.onRemove.bind(this, item._id) }><span>&#10006;</span></button>
            </li>
          ))
        }
      </ul>
    );
  }
}

export default compose(
  graphql(todoList, { options }),
  graphql(updateTodo, { name: 'updateTodo' }),
  graphql(removeTodo, { name: 'removeTodo' }),
)(TodoList);
