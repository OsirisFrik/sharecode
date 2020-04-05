require('dotenv').config();

const path = require('path');
const HtmlWebpackkPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  name: 'share-code',
  mode: 'development',
  entry: {
    app: './client/app.js',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
  },
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, 'public/src'),
    filename: '[name].bundle.js',
    publicPath: '/src/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackkPlugin({
      template: './client/index.html',
      base: '/src',
      analytics: process.env.GG_ANALYTICS
    }),
    new webpack.EnvironmentPlugin(['GH_CLIENT', 'GH_SECRET', 'GG_ANALYTICS'])
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  }
};