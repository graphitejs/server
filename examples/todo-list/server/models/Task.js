import { mongoose } from '@graphite/mongoose';
import { property, mutation, graphQl, query, create, update, remove, allow } from '@graphite/decorators';

@mongoose
@graphQl
class Task {
  @property('String | required | minlength=1 | maxlength=90')
  nameTask;

  @property('Boolean')
  statusTask = false;

  @query()
  @allow((_, task, {}) => true)
  getAllTask() {
    return this.Model.find();
  }

  @query()
  @allow((_, task, {}) => true)
  getSomeTask() {
    return this.Model.find();
  }

  @query()
  @allow((_, task, {}) => true)
  otroe() {
    return this.Model.find();
  }

  @mutation({ type: 'create' })
  @allow((_, Task, {}) => true)
  async createTask(_, { task }) {
    try {
      return await this.Model.create(task);
    } catch (err) {
      return [{
        key: '1',
        message: 'chau'
      }]
    }
  }

  @mutation({ type: 'update' })
  async updateTask(_, { id, task }) {
    try {
      return await this.Model.findByIdAndUpdate(id, task, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  @mutation({ type: 'remove' })
  async removeTask(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}

export default new Task();
