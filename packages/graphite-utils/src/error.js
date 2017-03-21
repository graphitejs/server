import debug from 'debug';
const logger = debug('Graphite-utils');

function GraphiteError(message = 'Default Message') {
  this.name = 'GraphiteError';
  this.message = message;
  this.stack = (new Error()).stack;
  logger(message, this.stack);
}

GraphiteError.prototype = Object.create(Error.prototype);
GraphiteError.prototype.constructor = GraphiteError;

export default MyError;
