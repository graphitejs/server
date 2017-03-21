const input = function(prop) {
  return (target, key) => {
    if (!target.Types) {
      Object.defineProperty(target, 'createTypes', {
        value: `${key}: ${prop},`,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      const currentTypes = target.createTypes;
      target.createTypes = `${currentTypes} \n ${key}: ${prop},`;
    }
  };
};

export default input;
