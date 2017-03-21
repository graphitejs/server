import {
  capitalize,
} from 'lodash';

const update = function(target, key) {
  target.update = (name) => {
    return `${key}(id: String, ${name.toLowerCase()}: update${capitalize(name)}): response${capitalize(name)}`;
  };
};

export default update;
