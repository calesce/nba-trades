var webpack = require('webpack');

module.exports = {
  devtool: 'eval',

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
    extensions: ['', '.js', '.jsx', '.css']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel', 'react-hot', 'jsx-loader'], exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style!css!sass', exclude: /node_modules/ },
      { test: /\.jpg$/, loader: 'url' }
    ]
  }
};
