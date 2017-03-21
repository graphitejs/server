const inputType = function(target, key) {
  target.createTypes = `${target.createTypes || ''}
                        ${key}: ${target[key]},`;
};

export default inputType;
