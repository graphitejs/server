import {
  capitalize,
} from 'lodash';

const hasMany = function(target, key, descriptor) {
  const currentTypes = target.Types || '';
  const currentCreateTypes = target.createTypes || '';
  const currentUpdateTypes = target.updateTypes || '';
  target.Types = `${currentTypes} \n ${key}: [${capitalize(key)}],`;
  target.createTypes = `${currentCreateTypes} \n ${key}: [String],`;
  target.updateTypes = `${currentUpdateTypes} \n ${key}: [String],`;
  target.hasMany = Object.assign({}, target.hasMany);

  target.hasMany[key.toLowerCase()] = async function() {
    try {
      return await descriptor.initializer()(...arguments);
    } catch (error) {
      throw new Error('Decorators hasMany failed. \n' + error);
    }
  };
};

export default hasMany;
