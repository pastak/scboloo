const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main.js',
    option: './src/option/option.js'
  },
  output: {
    filename: '[name].js',
    path: './dist'
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: './src/option/option.html', to: 'option/option.html'},
      {from: './src/manifest.json'}
    ]),
  ]
}
