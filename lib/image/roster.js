var Promise = require('bluebird');
var request = require('request-promise');
var teams = require('../teams.json');

var rosters = module.exports = exports = {};

rosters.individualTeamRoster = function(teamId) {
  var url = 'http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2014-15&TeamID=' + teamId;

  return request(url)
    .then(function(response) {
      var roster = JSON.parse(response).resultSets[0].rowSet.map(function(player) {
        return player[3];
      });

      return roster;
    })
    .catch(function(err) {
      throw err;
    });
};

rosters.format = function(theRosters) {
  return theRosters.map(function(roster) {
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
};

rosters.getRosters = function() {
  var promises = teams.map(function(team) {
    return rosters.individualTeamRoster(team.teamId);
  });

  return Promise.all(promises)
    .then(function(theTeams) {
      return rosters.format(theTeams);
    })
    .catch(function(err) {
      throw err;
    });
};
