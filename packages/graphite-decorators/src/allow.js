import { get } from 'lodash';

const allow = function(params) {
  return function(target, key, descriptor) {
    target[key].allow = params;
  };
};

export default allow;
