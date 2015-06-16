var url = require('url');
var Promise = require('bluebird');
var redis = Promise.promisifyAll(require('redis'));
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

module.exports = function() {
  return client.hgetallAsync('nba')
    .then(function(nbaTeams) {
      if(nbaTeams) {

        for(var team in nbaTeams) {
          nbaTeams[team] = JSON.parse(nbaTeams[team]);
        }

        return nbaTeams;
      }
      else {
        parse.collectTeamData()
          .then(function(theTeams) {
            var start = new Date();

            theTeams.forEach(function(theTeam) {
              client.hset('nba', theTeam.teamName, JSON.stringify(theTeam));
            });
            console.log('write to db took ' + (new Date() - start) + 'ms');

            return theTeams;
          })
          .catch(function(err) {
            throw err;
          });
      }
    })
    .catch(function(err) {
      throw err;
    });
};
