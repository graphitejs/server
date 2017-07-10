import { functionName, createResponseType, createInputType, addMutationToSchema } from '@graphite/utils';
import { mutation, create, update, remove, query } from '@graphite/decorators';
import { lowerFirst } from 'lodash';
import pluralize from 'pluralize';
import createModel from './crud/create';
import updateModel from './crud/update';
import removeModel from './crud/remove';
import fetchModel from './crud/fetch';

import Mongoose from 'mongoose';
import MongooseReadonly from 'mongoose-readonly/lib';
import customId from 'mongoose-hook-custom-id';
import debug from 'debug';
const logger = debug('mongoose');

const generateObjectId = function() {
  return Mongoose.Types.ObjectId();
};

const mongoose = function(target) {
  try {
    const name = functionName(target);
    Mongoose.Promise = global.Promise;
    const Schema = Mongoose.Schema;
    target.prototype.databaseName = 'mongoose';
    target.prototype.schemaModel = new Schema(target.prototype.schema);
    target.prototype.schemaModel.plugin(MongooseReadonly);
    target.prototype.schemaModel.plugin(customId, { mongoose: Mongoose, generator: generateObjectId });
    target.prototype.Model = Mongoose.model(name.toLowerCase(), target.prototype.schemaModel);
    target.prototype.Mongoose = Mongoose;

    target.prototype.schemaModel.virtual('id').get(function() {
      return this._id;
    });

    target.prototype.schemaModel.set('toJSON', {
      virtuals: true,
    });
  } catch (err) {
    logger(`Mongoose decorators: ${err}`);
  }
};

const crud = function() {
  return (target) => {
    const name = functionName(target);
    const namekeyCreate = `create${name}`;
    const namekeyUpdate = `update${name}`;
    const namekeyRemove = `remove${name}`;
    target.prototype[namekeyCreate] = createModel;
    target.prototype[namekeyUpdate] = updateModel;
    target.prototype[namekeyRemove] = removeModel;


    create(target.prototype, namekeyCreate);
    mutation()(target.prototype, namekeyCreate, { value: createModel });
    createInputType(target.prototype, name, 'create');
    addMutationToSchema(target.prototype, name, 'create');

    update(target.prototype, namekeyUpdate);
    mutation()(target.prototype, namekeyUpdate, { value: updateModel });
    createInputType(target.prototype, name, 'update');
    addMutationToSchema(target.prototype, name, 'update');

    remove(target.prototype, namekeyRemove);
    mutation()(target.prototype, namekeyRemove, { value: removeModel });
    createInputType(target.prototype, name, 'remove');
    addMutationToSchema(target.prototype, name, 'remove');

    createResponseType(target.prototype, name);

    target.prototype[pluralize(lowerFirst(name), 2)] = fetchModel;
    query()(target.prototype, pluralize(lowerFirst(name), 2), fetchModel);
  };
};

export { mongoose, generateObjectId, crud };
