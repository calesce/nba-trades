var webpack = require('webpack');

module.exports = {

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './app.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ }
    ]
  }
};
