import { mongoose, crud } from '@graphite/mongoose';
import { property, graphQl, hasOne } from '@graphite/decorators';
import School  from './School';

@crud()
@mongoose
@graphQl
class Student {
  @property('String | required | min=1 | max=90')
  name;

  @property('Boolean')
  active = false;

  @property('String | required')
  street

  // @property('String | required')
  // human = {
  //   default: 'MALE',
  //   options: [{
  //     value: 'MALE',
  //     label: 'Male',
  //   },
  //   {
  //     value: 'FEMALE',
  //     label: 'female',
  //   }],
  // }

  @hasOne
  async school(student) {
    try {
      return await School.Model.findOne({ _id: student.school });
    } catch (e) {
      return null;
    }
  }

  __admin__ = {
    school: {
      fields: ['name'],
      template: '{name}',
    },
  }
}

export default new Student();
