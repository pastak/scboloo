const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main.js',
    option: './src/option/option.js',
    popup: './src/popup/popup.js'
  },
  output: {
    filename: '[name].js',
    path: './dist'
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: './src/option/option.html', to: 'option/option.html'},
      {from: './src/popup/popup.html', to: 'popup/popup.html'},
      {from: './src/manifest.json'}
    ])
  ]
}
