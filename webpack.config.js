const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const exec = require('child_process').execSync

const isProductionBuild = process.env.NODE_ENV === 'production'

let plugins = [
  new CopyWebpackPlugin([
    {from: './src/option/option.html', to: 'option/option.html'},
    {from: './src/popup/popup.html', to: 'popup/popup.html'},
    {from: './src/manifest.json'},
    {from: './icons/*'}
  ]),
  new WebpackOnBuildPlugin(() => {
    exec('cp -R dist/common/* dist/chrome')
    exec('cp -R dist/common/* dist/firefox')
    exec('cp -R dist/common/* dist/msedge')
    exec('./node_modules/.bin/wemf -U --browser firefox dist/firefox/manifest.json')
    exec('./node_modules/.bin/wemf -U --browser chrome dist/chrome/manifest.json')
    exec('./node_modules/.bin/wemf -U --browser edge dist/msedge/manifest.json')
  })
]

if (isProductionBuild) plugins.push(new UglifyJSPlugin())

module.exports = {
  devtool: isProductionBuild ? 'inline-source-map' : false,
  entry: {
    main: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/main.js'],
    content: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/content.js'],
    option: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/option/option.js'],
    popup: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/popup/popup.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/common')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [['es2015', { 'modules': false }], 'es2017']
        }
      }
    ]
  },
  plugins
}
