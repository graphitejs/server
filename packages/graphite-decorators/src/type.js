const type = function(target, key, descriptor) {
  target.oTypes = `${target.oTypes || ''}
                   type ${key} {
                      ${descriptor.value()},
                   }`;
};

export default type;
