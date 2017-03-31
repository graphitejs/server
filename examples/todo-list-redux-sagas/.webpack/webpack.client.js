var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");

module.exports = {
  devtool: '#inline-source-map',
  entry: ['babel-polyfill', path.resolve('./client/App')],
  output: {
    path: path.resolve('./dist'),
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("./client/index.html"), // Load a custom template
      inject: true // Inject all scripts into the body
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: [/node_modules/], loader: 'babel-loader' },
      { test: /\.html$/, exclude: [/node_modules/], loader: "html-loader" },
      { test: /\.json$/, exclude: [/node_modules/], loader: "json" },
      { test: /\.scss$/, exclude: [/node_modules/], loaders: ['style', 'css', 'sass'] }
    ]
  },
  devServer: {
    inline: true
  }
};
