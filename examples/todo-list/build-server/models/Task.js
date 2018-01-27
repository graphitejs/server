'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _desc, _value, _class2, _descriptor, _descriptor2;

var _mongoose = require('@graphite/mongoose');

var _decorators = require('@graphite/decorators');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

let Task = (_dec = (0, _decorators.property)('String | required | minlength=1 | maxlength=90'), _dec2 = (0, _decorators.property)('Boolean'), _dec3 = (0, _decorators.query)(), _dec4 = (0, _decorators.allow)((_, task, {}) => true), _dec5 = (0, _decorators.query)(), _dec6 = (0, _decorators.allow)((_, task, {}) => true), _dec7 = (0, _decorators.query)(), _dec8 = (0, _decorators.allow)((_, task, {}) => true), _dec9 = (0, _decorators.mutation)({ type: 'create' }), _dec10 = (0, _decorators.allow)((_, Task, {}) => true), _dec11 = (0, _decorators.mutation)({ type: 'update' }), _dec12 = (0, _decorators.mutation)({ type: 'remove' }), (0, _mongoose.mongoose)(_class = (0, _decorators.graphQl)(_class = (_class2 = class Task {
  constructor() {
    _initDefineProp(this, 'nameTask', _descriptor, this);

    _initDefineProp(this, 'statusTask', _descriptor2, this);
  }

  getAllTask() {
    return this.Model.find();
  }

  getSomeTask() {
    return this.Model.find();
  }

  otroe() {
    return this.Model.find();
  }

  async createTask(_, { task }) {
    try {
      return await this.Model.create(task);
    } catch (err) {
      return [{
        key: '1',
        message: 'chau'
      }];
    }
  }

  async updateTask(_, { id, task }) {
    try {
      return await this.Model.findByIdAndUpdate(id, task, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  async removeTask(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'nameTask', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'statusTask', [_dec2], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'getAllTask', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'getAllTask'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSomeTask', [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSomeTask'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'otroe', [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, 'otroe'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'createTask', [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, 'createTask'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'updateTask', [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, 'updateTask'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'removeTask', [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, 'removeTask'), _class2.prototype)), _class2)) || _class) || _class);
exports.default = new Task();
//# sourceMappingURL=Task.js.map