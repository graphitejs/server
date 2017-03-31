import { mongoose } from '@graphite/mongoose';
import { property, mutation, graphQl, query, create, update, remove } from '@graphite/decorators';

@mongoose
@graphQl
class Todo {
  @property('String | required | minlength=1 | maxlength=90')
  name;

  @property('Boolean')
  status = false;

  @query()
  todo() {
    return this.Model.find();
  }

  @create
  @mutation()
  async createTodo(_, { todo }) {
    try {
      return await this.Model.create(todo);
    } catch (err) {
      return null;
    }
  }

  @update
  @mutation()
  async updateTodo(_, { id, todo }) {
    try {
      return await this.Model.findByIdAndUpdate(id, todo, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  @remove
  @mutation()
  async removeTodo(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}

export default new Todo();
