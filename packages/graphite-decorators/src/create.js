import { lowerFirst } from 'lodash';

const create = function(target, key) {
  target.create = (nameClass) => {
    return `${key}(${lowerFirst(nameClass)}: create${nameClass}): response${nameClass}`;
  };
};

export default create;
