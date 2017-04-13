const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')
const jsonUpdate = require('json-update')

let plugins = [
  new CopyWebpackPlugin([
    {from: './src/option/option.html', to: 'option/option.html'},
    {from: './src/popup/popup.html', to: 'popup/popup.html'},
    {from: './src/manifest.json'}
  ]),
  new WebpackOnBuildPlugin(() => {
    const manifest = require('./dist/msedge/manifest.json')
    jsonUpdate.update('./dist/msedge/manifest.json', {permissions: manifest.permissions.concat(['cookies'])})
  })
]

module.exports = {
  entry: {
    main: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/main.js'],
    option: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/option/option.js'],
    popup: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/popup/popup.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/msedge')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'es2017']
        }
      }
    ]
  },
  plugins
}
