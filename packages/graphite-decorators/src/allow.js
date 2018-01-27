const allow = function(params) {
  return function(target, key) {
    target[key].allow = params;
  };
};

export default allow;
