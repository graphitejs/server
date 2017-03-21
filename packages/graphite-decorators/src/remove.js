import {
  capitalize,
} from 'lodash';

const remove = function(target, key) {
  target.remove = (name) => {
    return `${key}(id: String): response${capitalize(name)}`;
  };
};

export default remove;
