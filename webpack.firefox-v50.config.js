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
    exec('sed -i -e "s/52\.0/50.0/" dist/firefox-v50/manifest.json')
    exec('./node_modules/.bin/wemf dist/firefox-v50/manifest.json -U')
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
    path: 'dist/firefox-v50'
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
