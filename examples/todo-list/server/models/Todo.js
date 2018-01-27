import { mongoose } from '@graphite/mongoose';
import { property, mutation, graphQl, query, create, update, remove, allow } from '@graphite/decorators';

@mongoose
@graphQl
class Todo {
  @property('String | required | minlength=1 | maxlength=90')
  name;

  @property('Boolean')
  status = false;

  @query()
  @allow((_, todo, {}) => true)
  getAllTodo() {
    return this.Model.find();
  }

  @query()
  @allow((_, todo, {}) => true)
  getSomeTodo() {
    return this.Model.find();
  }

  @mutation({ type: 'create' })
  @allow((_, todo, {}) => true)
  async createTodo(_, { todo }) {
    try {
      return await this.Model.create(todo);
    } catch (err) {
      return [{
        key: '1',
        message: 'create'
      }]
    }
  }

  @mutation({ type: 'update' })
  async updateTodo(_, { id, todo }) {
    try {
      return await this.Model.findByIdAndUpdate(id, todo, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  @mutation({ type: 'remove' })
  async removeTodo(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}

export default new Todo();
