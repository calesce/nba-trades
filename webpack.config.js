module.exports = {
  devtool: 'eval',
  
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  
  module: {
    loaders: [
      { test: /\.js?/, loader: 'jsx-loader', exclude: /node_modules/ }
    ]
  }
};