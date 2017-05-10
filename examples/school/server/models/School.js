import { mongoose, crud } from '@graphite/mongoose';
import { property, graphQl, hasMany } from '@graphite/decorators';
import Student from './Student';

@crud()
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

  __admin__ = {
    listDisplay: ['name', 'student'],
  }

}

export default new School();
