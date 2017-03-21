import { expect } from 'chai';
import errors from '../src/errors';

describe('Errors', () => {
  it('should be a function', (done) => {
    const errorList = {
      required: 'This field is required.',
      minlength: 'This field',
    };

    const decoratorError = errors(errorList);
    expect(decoratorError).to.be.function;
    done();
  });

  it('should be modify schema with errors', (done) => {
    const errorList = {
      required: 'This field is required.',
      minlength: 'This field required min 6.',
    };
    const decoratorError = errors(errorList);

    const target = function() {};
    target.schema = {
      name: {
        name: String,
        required: true,
        minlength: 6,
      },
    };

    const key = 'name';
    decoratorError(target, key);
    expect(target.schema.name.required).to.be.array;
    expect(target.schema.name.required[0]).to.be.true;
    expect(target.schema.name.required[1]).eql('This field is required.');
    expect(target.schema.name.minlength).to.be.array;
    expect(target.schema.name.minlength[0]).eql(6);
    expect(target.schema.name.minlength[1]).eql('This field required min 6.');
    done();
  });
});
