import { keys, upperFirst, get, values, difference, lowerFirst } from 'lodash';
import path from 'path';
import DynRequire from 'dyn-require';
import debug from 'debug';
const logger = debug('mongoose');

const updateModel = async function(_, data) {
  try {
    const modelId = values(data)[0];
    const model = values(data)[1];
    const rootPath = path.dirname(require.main.filename || process.mainModule.filename);
    const keysHasMany = keys(get(this, 'hasMany', {}));
    const keysHasOne = keys(get(this, 'hasOne', {}));

    const modules = new DynRequire(`${rootPath}/models`);
    const oldModel = await this.Model.findById(modelId);
    const modelUpdated = await this.Model.findByIdAndUpdate(modelId, model, { 'new': true });
    logger(`Update model ${upperFirst(this.nameClass)}, id ${modelId}`);
    const updateItem = {};
    updateItem[lowerFirst(this.nameClass)] = modelUpdated._id;

    keysHasMany.forEach(async (keyHasMany) => {
      const diffItems = difference(oldModel[keyHasMany], modelUpdated[keyHasMany]);
      const modelModule = modules.require(upperFirst(keyHasMany));
      const arrItems = modelUpdated[keyHasMany];

      if (get(modelModule.default.hasMany, lowerFirst(this.nameClass), false)) {
        logger(`Update ${upperFirst(keyHasMany)}, relation many[${upperFirst(keyHasMany)}] to many[${upperFirst(this.nameClass)}]`);
      }

      if (get(modelModule.default.hasOne, lowerFirst(this.nameClass), false)) {
        logger(`Update ${upperFirst(keyHasMany)}, relation many[${upperFirst(keyHasMany)}] to one[${upperFirst(this.nameClass)}]`);
        try {
          await modelModule.default.Model.update({ _id: { $in: arrItems }}, { $set: updateItem }, { multi: true });
          logger(`Update ${upperFirst(keyHasMany)}, id: ${arrItems.join(' ')} - parameters ${JSON.stringify(updateItem)}`);
        } catch (error) {
          logger(`Error ${e}`);
        }

        updateItem[lowerFirst(this.nameClass)] = null;
        logger(`Update remove relation ${upperFirst(this.nameClass)} to ${upperFirst(keyHasMany)} ${diffItems.join(' ')}`);
        diffItems.forEach(async (_id) => {
          try {
            await modelModule.default.Model.update({ _id }, { $set: updateItem });
            logger(`Update ${upperFirst(keyHasMany)}, id: ${diffItems.join(' ')} - parameters ${JSON.stringify(updateItem)}`);
          } catch (error) {
            logger(`Error ${error}`);
          }
        });
      }
    });

    keysHasOne.forEach(async (keyHasOne) => {
      const modelModule = modules.require(upperFirst(keyHasOne));
      const item = modelUpdated[keyHasOne];

      if (get(modelModule.default.hasMany, lowerFirst(this.nameClass), false)) {
        logger(`Update ${upperFirst(keyHasOne)}, relation many[${upperFirst(keyHasOne)}] to one[${upperFirst(this.nameClass)}]`);
        try {
          await modelModule.default.Model.update({ _id: item }, { $set: updateItem });
          logger(`Update ${upperFirst(keyHasOne)}, id: ${item} - parameters ${JSON.stringify(updateItem)}`);
        } catch (error) {
          logger(`Error ${error}`);
        }

        updateItem[lowerFirst(this.nameClass)] = item;
        if (oldModel[keyHasOne] !== modelUpdated[keyHasOne]) {
          try {
            await modelModule.default.Model.update({ _id: oldModel[keyHasOne]._id }, { $pull: updateItem });
            logger(`Update ${upperFirst(keyHasOne)} - parameters ${JSON.stringify(updateItem)}`);
          } catch (error) {
            logger(`Error ${error}`);
          }
        }
      }

      if (get(modelModule.default.hasOne, lowerFirst(this.nameClass), false)) {
        logger(`Update ${upperFirst(keyHasOne)}, relation one[${upperFirst(keyHasOne)}] to one[${upperFirst(this.nameClass)}]`);
      }
    });

    return modelUpdated;
  } catch (err) {
    return null;
  }
};

export default updateModel;
