var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.client.js");
debug = require("debug")("Webpack");

var PORT= 4000;
var HOST= 'localhost';

var compiler = webpack(config);

// We give notice in the terminal when it starts bundling and
// set the time it started
compiler.plugin('compile', function() {
  console.log("");
  debug('Bundling your application');
  bundleStart = Date.now();
});

// We also give notice when it is done compiling, including the
// time it took. Nice to have
compiler.plugin('done', function() {
  debug('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
});

var server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: false,
  compress: true,
  proxy: {
    '**': {
      target: 'http://localhost:8001',
      logProvider: function() {
        debug = require("debug")("Webpack");
        var myCustomProvider = {
            log: debug,
            debug: debug,
            info: debug,
            warn: debug,
            error: debug
        }
        return myCustomProvider;
      }
    }
  },
  setup: function(app) {},
  staticOptions: {},
  clientLogLevel: "none",
  quiet: true,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  headers: { "X-Custom-Header": "yes" }
});

server.listen(PORT, HOST, function() {
  console.log(`The application is running in http://${HOST}:${PORT}`);
});
