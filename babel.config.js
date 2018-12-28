const presets = ["@babel/react", ["@babel/preset-env", {
  "targets": {
    "node": "9.0"
  }
}]]

const plugins = [
  ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
  ["@babel/plugin-proposal-class-properties"],
  "@babel/plugin-syntax-dynamic-import",
]

module.exports = { presets, plugins };
