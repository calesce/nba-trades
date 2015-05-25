var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');

var rosters = module.exports = exports = {};

rosters.getTeamIds = function(cb) {
  var filePath = path.join(__dirname, '../teams.json');

  fs.readFile(filePath, 'utf8', function(err, data) {
    if(err) {
      return cb(err, null);
    }

    return cb(null, JSON.parse(data).map(function(team) {
      return team.teamId;
    }));
  });
};

rosters.individualTeamRoster = function(teamId, cb) {
  var url = 'http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2014-15&TeamID=' + teamId;

  request(url, function(err, response, body) {

    if(err) {
      return cb(err, null);
    }
    else if(response.statusCode !== 200) {
      return cb(response.statusCode, null);
    }

    var roster = JSON.parse(body).resultSets[0].rowSet.map(function(player) {
      return player[3];
    });

    return cb(null, roster);
  });
};

rosters.getRosterForTeams = function(cb) {

  rosters.getTeamIds(function(e, teams) {
    var theRosters = [];

    async.eachSeries(teams, function(team, asyncCallback) {

      rosters.individualTeamRoster(team, function(err, roster) {
        if(err) {
          return cb(err);
        }

        theRosters.push(roster);
        asyncCallback();
      });
    }, function(err) {
      if(err) {
        return cb(err, null);
      }

      theRosters = theRosters.map(function(roster) {
        return roster.map(function(player) {
          player = player.toLowerCase().replace(/\ /g, '_');
          player = player.replace(/\'/g, '');
          player = player.replace(/\./g, '');
          player = player.replace('_iii', '');
          player = player.replace('jose_juan', 'jose');
          player = player.replace('gigi', 'luigi');

          return player.replace('tim_hardaway_jr', 'timothy_hardaway');
        });
      });

      return cb(null, theRosters);
    });
  });
};
