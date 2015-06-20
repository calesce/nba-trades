var webpack = require('webpack');
var express = require('express');
var salaries = require('./lib/salaries');
var url = require('url');
var path = require('path');

var isProduction = process.env.NODE_ENV === 'production';

if(isProduction) {
  var config = require('./webpack.production');
  var server = express();

  server.use(express.static(path.join(__dirname, '/dist')));

  server.get('/api', salaries);

  server.listen(3000);
}
else {
  var app = express();

  var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Origin, Accept');
    next();
  };

  app.use(allowCrossDomain);

  app.get('/api', allowCrossDomain, salaries);

  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');

  var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
  });

  server.listen(3000, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}

app.listen(8080);
