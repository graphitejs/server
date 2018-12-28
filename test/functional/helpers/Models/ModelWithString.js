import { graphQl, property, query } from '../../../../packages/graphite-decorators/src/decorators';

@graphQl
class ModelWithString {
  @property('String')
  name;

  @property('String')
  street;
}

console.log("ModelWithString ",ModelWithString.Types)

const test = new ModelWithString()

console.log("test ",test)

export default new ModelWithString();
