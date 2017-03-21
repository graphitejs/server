const errors = function(errorList) {
  return (target, key) => {
    const keysErrors = Object.keys(errorList);
    keysErrors.forEach((keyError) => {
      const value = target.schema[key][keyError];
      target.schema[key][keyError] = [value, errorList[keyError]];
    });
  };
};

export default errors;
