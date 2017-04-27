import { keys, capitalize, get, values } from 'lodash';
import path from 'path';
import DynRequire from 'dyn-require';

const updateModel = async function(_, data) {
  try {
    const modelId = values(data)[0];
    const model = values(data)[1];
    const rootPath = path.dirname(require.main.filename || process.mainModule.filename);
    const keysHasMany = keys(get(this, 'hasMany', {}));
    const keysHasOne = keys(get(this, 'hasOne', {}));

    const modules = new DynRequire(`${rootPath}/models`);

    const modelUpdated = await this.Model.findByIdAndUpdate(modelId, model, { 'new': true });
    const updateItem = {};
    updateItem[this.nameClass.toLowerCase()] = modelUpdated._id;

    keysHasMany.forEach(async (keyHasMany) => {
      const modelModule = modules.require(capitalize(keyHasMany));
      const arrItems = modelUpdated[keyHasMany];
      await modelModule.default.Model.update({ _id: { $in: arrItems }}, { $set: updateItem }, { multi: true });
    });

    keysHasOne.forEach(async (keyHasOne) => {
      const modelModule = modules.require(capitalize(keyHasOne));
      const item = modelUpdated[keyHasOne];
      await modelModule.default.Model.update({ _id: item }, { $set: updateItem });
    });

    return modelUpdated;
  } catch (err) {
    return null;
  }
};

export default updateModel;
