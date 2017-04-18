const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')
const exec = require('child_process').execSync

let plugins = [
  new CopyWebpackPlugin([
    {from: './src/option/option.html', to: 'option/option.html'},
    {from: './src/popup/popup.html', to: 'popup/popup.html'},
    {from: './src/manifest.json'}
  ]),
  new WebpackOnBuildPlugin(() => {
    exec('cp -R dist/common/* dist/chrome')
    exec('cp -R dist/common/* dist/firefox')
    exec('./node_modules/.bin/wemf -U --browser firefox dist/firefox/manifest.json')
    exec('./node_modules/.bin/wemf -U --browser chrome dist/chrome/manifest.json')
  })
]

module.exports = {
  entry: {
    main: ['chrome-browser-object-polyfill', './src/main.js'],
    content: ['chrome-browser-object-polyfill', 'babel-polyfill', './src/content.js'],
    option: ['chrome-browser-object-polyfill', './src/option/option.js'],
    popup: ['chrome-browser-object-polyfill', './src/popup/popup.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/common')
  },
  plugins
}
