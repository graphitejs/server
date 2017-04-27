import { mongoose, crud } from '@graphite/mongoose';
import { property, graphQl } from '@graphite/decorators';

@crud()
@mongoose
@graphQl
class Teacher {
  @property('String | required | min=1 | max=90')
  name;

  @property('Boolean')
  active = false;

  @property('String | required')
  street
}

export default new Teacher();
