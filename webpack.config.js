module.exports = {
  devtool: 'eval',
  
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel!jsx-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ }
    ]
  }
};