export const functionName = (fun) => {
  try {
    if (fun.name) {
      return fun.name;
    }
    let ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  } catch (err) {
    throw new Error(err);
  }
};
