// Load modules

var Hapi = require('hapi');
var Salaries = require('./salaries');

exports.init = function(port, next) {

  var server = new Hapi.Server();
  server.connection({ port: port });

  server.register(Salaries, function(err) {

    if(err) {
      return next(err);
    }

    server.start(function(error) {
      return next(error, server);
    });
  });
};
