'use strict';

var _default = require('./config/default');

var _apolloExpress = require('@graphite/apollo-express');

var _mongoose = require('@graphite/mongoose');

var _Todo = require('./models/Todo');

var _Todo2 = _interopRequireDefault(_Todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mongoose = new _mongoose.Mongodb(_default.database);
mongoose.connect();
console.log("dd");

_apolloExpress.Graphite.graphQLServer({ graphql: _default.graphql }, [_Todo2.default]);
//# sourceMappingURL=main.js.map