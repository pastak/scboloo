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
    exec('./node_modules/.bin/wemf dist/firefox/manifest.json -U')
  })
]

module.exports = {
  entry: {
    main: './src/main.js',
    option: './src/option/option.js',
    popup: './src/popup/popup.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/common')
  },
  plugins
}
