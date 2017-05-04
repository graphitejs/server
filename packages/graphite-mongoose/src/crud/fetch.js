const fetchModel = async function(_, { _id, skip, limit, sort }) {
  const query = _id ? { _id } : {};
  const options = {};

  if (skip) {
    options.skip = skip;
  }

  if (limit) {
    options.limit = limit;
  }

  if (sort) {
    options.sort = sort;
  }

  return this.Model.find(query, {}, options);
};

export default fetchModel;
