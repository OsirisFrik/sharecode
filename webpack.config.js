const path = require('path');
const HtmlWebpackkPlugin = require('html-webpack-plugin');
const DotEnv = require('dotenv-webpack');

module.exports = {
  name: 'share-code',
  mode: 'development',
  entry: {
    main: './client/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/src'),
    filename: '[name].bundle.js',
    publicPath: '/src'
  },
  plugins: [
    new HtmlWebpackkPlugin({
      template: './client/index.html',
      base: '/src'
    }),
    new DotEnv({
      path: 'client.env'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}