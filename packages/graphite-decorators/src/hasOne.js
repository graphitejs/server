import {
  capitalize,
} from 'lodash';

const hasOne = function(target, key, descriptor) {
  const attrModel = {};
  attrModel[key] = String;
  target.schema = Object.assign({}, target.schema, attrModel);
  const currentTypes = target.Types || '';
  const currentCreateTypes = target.createTypes || '';
  const currentUpdateTypes = target.createTypes || '';
  target.Types = `${currentTypes} \n ${key}: ${capitalize(key)},`;
  target.createTypes = `${currentCreateTypes} \n ${key}: String,`;
  target.updateTypes = `${currentUpdateTypes} \n ${key}: String,`;
  target.hasOne = Object.assign({}, target.hasOne);

  target.hasOne[key.toLowerCase()] = async function() {
    try {
      return await descriptor.value.bind(target)(...arguments);
    } catch (error) {
      throw new Error('Decorators hasOne failed. \n' + error);
    }
  };
};

export default hasOne;
