import { keys, capitalize, get, values } from 'lodash';
import path from 'path';
import DynRequire from 'dyn-require';

const createModel = async function(_, data) {
  try {
    const model = values(data)[0];
    const rootPath = path.dirname(require.main.filename || process.mainModule.filename);
    const keysHasMany = keys(get(this, 'hasMany', {}));
    const keysHasOne = keys(get(this, 'hasOne', {}));

    const modules = new DynRequire(`${rootPath}/models`);

    const modelCreated = await this.Model.create(model);
    const updateItem = {};
    updateItem[this.nameClass.toLowerCase()] = modelCreated._id;

    keysHasMany.forEach(async (keyHasMany) => {
      const modelModule = modules.require(capitalize(keyHasMany));
      const arrItems = modelCreated[keyHasMany];
      if (modelModule.default.Model) {
        await modelModule.default.Model.update({ _id: { $in: arrItems }}, { $set: updateItem }, { multi: true });
      }
    });

    keysHasOne.forEach(async (keyHasOne) => {
      const modelModule = modules.require(capitalize(keyHasOne));
      const item = modelCreated[keyHasOne];
      if (modelModule.default.Model) {
        await modelModule.default.Model.update({ _id: item }, { $set: updateItem });
      }
    });

    return modelCreated;
  } catch (err) {
    const errorKeys = Object.keys(err.errors);
    return errorKeys.reduce((errorsCreate, error) => {
      errorsCreate.push({ key: error, message: err.errors[error].message });
      return errorsCreate;
    }, []);
  }
};

export default createModel;
