import { mongoose } from '@graphite/mongoose';
import { property, mutation, graphQl, query, create, update, remove, allow, hasMany } from '@graphite/decorators';
import Student from './Student';

@mongoose
@graphQl
class School {
  @property('String | required | min=1 | max=90')
  name;

  @property('Boolean')
  active = false;

  @property('String | required')
  street

  @hasMany
  async student(school) {
    try {
      return await Student.Model.find({ school: school._id });
    } catch (e) {
      return null;
    }
  }

  @query()
  @allow((_, todo, {}) => true)
  schools() {
    return this.Model.find();
  }

  @create
  @mutation()
  @allow((_, todo, {}) => true)
  async createSchool(_, { school }) {
    try {
      const schoolCreated = await this.Model.create(school);
      await Student.Model.update({ _id: { $in: schoolCreated.student }}, { $set: { school: schoolCreated._id }}, { multi: true });
      return schoolCreated;
    } catch (err) {
      const errorKeys = Object.keys(err.errors);
      return errorKeys.reduce((errorsCreate, error) => {
        errorsCreate.push({ key: error, message: err.errors[error].message });
        return errorsCreate;
      }, []);
    }
  }

  @update
  @mutation()
  async updateSchool(_, { id, school }) {
    try {
      return await this.Model.findByIdAndUpdate(id, school, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  @remove
  @mutation()
  async removeSchool(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}

export default new School();
