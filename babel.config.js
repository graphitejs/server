const presets = [["@babel/preset-env", {
  "targets": {
    "node": "9.0"
  }
}]]

const plugins = [
  "@babel/plugin-syntax-dynamic-import",
]

module.exports = { presets, plugins };
