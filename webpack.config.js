require('dotenv').config();
const path = require('path');
const HtmlWebpackkPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

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
    new webpack.EnvironmentPlugin(['GH_CLIENT', 'GH_SECRET'])
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