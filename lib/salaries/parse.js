var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = require('request-promise');
var teamsData = require('../teams.json');

var parser = module.exports = exports = {};

parser.collectTeamData = function() {
  var promises = teamsData.map(function(team, index) {
    return parser.grabTeamHtml(index + 1);
  });

  return Promise.all(promises)
    .then(function(teams) {
      return teams.map(function(team, index) {
        return {
          teamName: teamsData[index].teamName,
          location: teamsData[index].location,
          totalSalary: team.totalSalary,
          players: team.players
        };
      });
    })
    .catch(function(err) {
      throw err;
    });
};

parser.grabTeamHtml = function(id) {
  return request('http://hw-files.com/tools/salaries/salaries_widget_new.php?team_id=' + id)
    .then(function(response) {
      return parser.parseTeamPage(response);
    })
    .catch(function(err) {
      throw err;
    });
};

parser.parseTeamPage = function(html) {
  var $ = cheerio.load(html);

  var players = [];

  $('tbody').find('a').each(function(i, elem) {
    var name = $(this).text();
    var salary = $(this).parent().next().text();

    players.push({
      name: name,
      salary: salary
    });
  });

  return {
    totalSalary: $('tbody').children().last().children().next().html(),
    players: parser.sanitizePlayers(players)
  };
};

parser.sanitizePlayers = function(players) {
  return players
    .filter(function(player) {
      return (player.name.indexOf(')') === -1 && player.name.indexOf('--') === -1);
    })
    .map(function(player) {
      player.name = player.name.replace('tapher', '');
      player.name = player.name.replace('Damjam', 'Damjan');
      player.name = player.name.replace('Jakaar', 'Jakarr');
      player.name = player.name.replace('Louis Amundson', 'Lou Amundson');
      player.name = player.name.replace('Matt Dellavedova', 'Matthew Dellavedova');
      player.name = player.name.replace('McAdoo', 'Michael McAdoo');
      player.name = player.name.replace('Grant Jarrett', 'Grant Jerrett');
      player.name = player.name.replace('Jeffrey', 'Jeff');
      player.name = player.name.replace('Jose Juan', 'Jose');
      player.name = player.name.replace('Tim Hardaway', 'Timothy Hardaway');

      player.imageUrl = player.name.toLowerCase().replace(/\ /g, '_');
      player.imageUrl = player.imageUrl.replace(/\.+/g, '');
      player.imageUrl = player.imageUrl.replace(/\_iii|\_jr|\\\'/g, '');
      player.imageUrl = '/assets/images/' + player.imageUrl + '.jpg';

      return player;
    });
};
