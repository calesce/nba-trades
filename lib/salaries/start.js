// Load modules

var Server = require('./index');

Server.init(8000, function(err, server) {
  if(err) {
    console.log(err);
  }

  console.log('Server start at ' + server.info.uri);
});
