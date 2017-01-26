const CopyWebpackPlugin = require('copy-webpack-plugin')

let plugins = [
  new CopyWebpackPlugin([
    {from: './src/option/option.html', to: 'option/option.html'},
    {from: './src/popup/popup.html', to: 'popup/popup.html'},
    {from: './src/manifest.json'}
  ])
]

module.exports = {
  entry: {
    main: './src/main.js',
    option: './src/option/option.js',
    popup: './src/popup/popup.js'
  },
  output: {
    filename: '[name].js',
    path: 'dist/msedge'
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
