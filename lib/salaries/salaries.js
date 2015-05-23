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
      parse.collectTeamData(function(error, teams) {
        if(err) {
          callback(error, null);
        }

        var start = new Date();
        for (var team in teams) {
          client.hset('nba', team, JSON.stringify(teams[team]));
        }
        console.log('write to db took ' + (new Date() - start) + 'ms');

        callback(null, teams);
      });
    }
  });
}

module.exports = {
  checkIfCached: checkIfCached
};
