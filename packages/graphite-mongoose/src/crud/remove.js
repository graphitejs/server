import { keys, capitalize, get, values } from 'lodash';
import path from 'path';
import DynRequire from 'dyn-require';

const removeModel = async function(_, data) {
  try {
    const modelId = values(data)[0];
    const rootPath = path.dirname(require.main.filename || process.mainModule.filename);
    const keysHasMany = keys(get(this, 'hasMany', {}));
    const keysHasOne = keys(get(this, 'hasOne', {}));

    const modules = new DynRequire(`${rootPath}/models`);

    const modelRemoved = await this.Model.findByIdAndRemove(modelId);
    const removeItemHasMany = {};
    removeItemHasMany[this.nameClass.toLowerCase()] = { _id: modelRemoved._id };

    const removeItemHasOne = {};
    removeItemHasOne[this.nameClass.toLowerCase()] = null;

    keysHasMany.forEach(async (keyHasMany) => {
      const modelModule = modules.require(capitalize(keyHasMany));
      await modelModule.default.Model.update({ _id: { $in: modelRemoved.student }},  { $pull: removeItemHasMany }, { multi: true });
    });

    keysHasOne.forEach(async (keyHasOne) => {
      const modelModule = modules.require(capitalize(keyHasOne));
      await modelModule.default.Model.update({ _id: modelRemoved.student }, { $set: removeItemHasOne });
    });

    return modelRemoved;
  } catch (err) {
    return null;
  }
};

export default removeModel;
