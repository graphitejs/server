'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _desc, _value, _class2, _descriptor, _descriptor2;

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

let Todo = (_dec = (0, _decorators.property)('String | required | minlength=1 | maxlength=90'), _dec2 = (0, _decorators.property)('Boolean'), _dec3 = (0, _decorators.query)(), _dec4 = (0, _decorators.allow)((_, todo, {}) => true), _dec5 = (0, _decorators.query)(), _dec6 = (0, _decorators.allow)((_, todo, {}) => true), _dec7 = (0, _decorators.mutation)({ type: 'create' }), _dec8 = (0, _decorators.allow)((_, todo, {}) => true), _dec9 = (0, _decorators.mutation)({ type: 'update' }), _dec10 = (0, _decorators.mutation)({ type: 'remove' }), (0, _mongoose.mongoose)(_class = (0, _decorators.graphQl)(_class = (_class2 = class Todo {
  constructor() {
    _initDefineProp(this, 'name', _descriptor, this);

    _initDefineProp(this, 'status', _descriptor2, this);
  }

  getAllTodo() {
    return this.Model.find();
  }

  getSomeTodo() {
    return this.Model.find();
  }

  async createTodo(_, { todo }) {
    try {
      return await this.Model.create(todo);
    } catch (err) {
      return [{
        key: '1',
        message: 'create'
      }];
    }
  }

  async updateTodo(_, { id, todo }) {
    try {
      return await this.Model.findByIdAndUpdate(id, todo, { 'new': true });
    } catch (err) {
      return null;
    }
  }

  async removeTodo(_, { id }) {
    try {
      return await this.Model.findByIdAndRemove(id);
    } catch (err) {
      return null;
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'name', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'status', [_dec2], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'getAllTodo', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'getAllTodo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSomeTodo', [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSomeTodo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'createTodo', [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, 'createTodo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'updateTodo', [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, 'updateTodo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'removeTodo', [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, 'removeTodo'), _class2.prototype)), _class2)) || _class) || _class);
exports.default = new Todo();
//# sourceMappingURL=Todo.js.map