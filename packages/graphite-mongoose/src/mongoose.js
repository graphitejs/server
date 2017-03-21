import Mongoose from 'mongoose';
import { database } from './config/default';
import { mongoose } from './decorators';
import debug from 'debug';

class Mongodb {
  logger = debug('mongoose - mongoose');

  constructor(config = database) {
    Mongoose.Promise = global.Promise;
    this.dbName = config.NAME;
    this.port = config.PORT;
    this.Mongoose = Mongoose;
  }

  connect() {
    return new Promise((resolve) => {
      Mongoose.connect(`mongodb://localhost:${this.port}/${this.dbName}`);
      Mongoose.connection.on('connected', () => {
        this.logger(`Connect to database name: ${this.dbName} on port: ${this.port}`);
        resolve(Mongoose);
      });

      Mongoose.connection.on('error', (err) => {
        this.logger(`Mongoose default connection error:  ${err}`);
        throw new Error('Connection failed.');
      });
    });
  }

  disconnect() {
    Mongoose.Mongoose();
  }
}

export default { Mongodb, mongoose };
