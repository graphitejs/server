import { functionName } from '@graphite/utils';
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
  } catch (err) {
    logger(`Mongoose decorators: ${err}`);
  }
};

export { mongoose, generateObjectId };
