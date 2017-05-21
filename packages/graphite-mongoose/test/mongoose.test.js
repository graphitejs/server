import { expect } from 'chai';
import { Mongodb } from '../src/mongoose';
import { database } from '../src/config/default';

describe('Mongoose', () => {
  it('should return a instance of Mongoose', (done) => {
    const mongoose = new Mongodb();
    expect(mongoose).to.be.an.instanceof(Mongodb);
    done();
  });

  it('should connect database', (done) => {
    const mongoose = new Mongodb();
    mongoose.connect().then(connection => {
      expect(database.NAME).eql(connection.connections[0].name);
      mongoose.disconnect();
      done();
    });
  });

  it('should fail connection', (done) => {
    const mongoose = new Mongodb({ PORT: undefined, NAME: undefined });
    mongoose.connect().then().catch((error) => {
      expect(error).eql('Connection failed.');
      done();
    });
  });

  it('should trigger unhandledRejection when fail connect', (done) => {
    const mongoose = new Mongodb({ PORT: undefined, NAME: undefined });
    mongoose.connect();

    process.on('unhandledRejection', (reason) => {
      expect(reason.name).eql('Error');
      done();
    });
  });
});
