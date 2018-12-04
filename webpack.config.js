const path = require('path');

module.exports = {
  entry: "./index.js",
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "bundle.js"
  },
  mode: "development",
  devtool: 'source-map',
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                  presets: ['@babel/env', '@babel/react']
              }
          }
      ]
  },
  resolve: {
      alias: {
          "react-native": "react-native-web"
      },
      extensions: [ '.web.js', '.js' ]    
   }
};