// Load modules

var url = require('url');
var redis = require('redis');
var parse = require('./parse');

var client;
if(process.env.REDISCLOUD_URL) {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true });
  client.auth(redisURL.auth.split(':')[1]);
}
else {
  client = redis.createClient();
}

client.on('error', function(err) {
  console.log(err);
});

function checkIfCached(callback) {
  var nba = client.hgetall('nba', function(err, nbaTeams) {
    if(err) {
      callback(err, null);
    }

    if(nbaTeams) {
      for(var team in nbaTeams) {
        nbaTeams[team] = JSON.parse(nbaTeams[team]);
      }

      callback(null, nbaTeams);
    }
    else {
      parse.collectTeamData(haveTeams);
    }
  });

  function haveTeams(teams) {
    var start = new Date();
    for (var team in teams) {
      client.hset('nba', team, JSON.stringify(teams[team]));
    }
    console.log('write to db took ' + (new Date() - start) + 'ms');

    callback(teams);
  }
}

exports.register = function(server, options, next) {
  server.route({
    method: 'GET',
    path: '/salaries',
    config: {
      description: 'Returns the team salaries',
      handler: function(request, reply) {

        checkIfCached(function(err, teams) {
          if(err) {
            throw err;
          }

          return reply(teams);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'salaries'
};
