import {
  capitalize,
} from 'lodash';

const create = function(target, key) {
  target.create = (name) => {
    return `${key}(${name.toLowerCase()}: create${capitalize(name)}): response${capitalize(name)}`;
  };
};

export default create;
