const functionName = function(fun) {
  try {
    let ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  functionName,
};
