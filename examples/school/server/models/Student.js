import { mongoose } from '@graphite/mongoose';
import { property, mutation, graphQl, query, create, update, remove, allow, hasOne } from '@graphite/decorators';
import School  from './School';

@mongoose
@graphQl
class Student {
  @property('String | required | min=1 | max=90')
  name;

  @property('Boolean')
  active = false;

  @property('String | required')
  street

  @hasOne
  async school(student) {
    try {
      return await School.Model.findOne({ _id: student.school });
    } catch (e) {
      return null;
    }
  }

  @query()
  @allow((_, todo, {}) => true)
  students() {
    return this.Model.find();
  }

  @create
  @mutation()
  @allow((_, todo, {}) => true)
  async createStudent(_, { student }) {
    try {
      const studentCreated =  await this.Model.create(student);
      await School.Model.update({ _id: studentCreated.school }, { $push: { student: studentCreated._id }});
      return studentCreated;
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
  async updateStudent(_, { id, student }) {
    try {
      console.log("student ",student);
      return await this.Model.findByIdAndUpdate(id, student, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  @remove
  @mutation()
  async removeStudent(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}

export default new Student();
