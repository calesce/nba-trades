var http = require('http'),
  async = require('async'),
  cheerio = require('cheerio'),
  teamsData = require('./teams');

var options = {
  host: 'hw-files.com',
  method: 'GET'
};

var parser = module.exports = exports = {};

parser.collectTeamData = function(callback) {
  var teams = {};

  var teamsList = teamsData.map(function(team) {
    return team.teamName;
  });

  async.eachSeries(teamsList, addTeam, allAdded);

  function addTeam(team, asyncCallback) {
    var index = teamsList.indexOf(team) + 1;

    parser.grabTeamHtml(index, function(teamData) {
      if(teamData) {
        teams[team] = teamData;
        teams[team].teamName = team;
        teams[team].location = parser.getLocation(team, teamsData);
      }
      else {
        asyncCallback('error: team data not available');
      }
      asyncCallback();
    });
  }

  function allAdded(err) {
    if (err) {
      callback(err, null);
    }

    callback(null, teams);
  }
};

parser.getLocation = function(teamName, data) {
  return data.filter(function(team) {
    return team.teamName === teamName;
  })[0].location;
};

parser.grabTeamHtml = function(id, callback) {
  options.path = '/tools/salaries/salaries_widget_new.php?team_id=' + id;

  var request = http.request(options, function(response) {
    response.setEncoding('utf8');

    var responseString = '';

    response.on('data', function(chunk) {
      responseString += chunk;
    });

    response.on('end', function() {
      var players = parser.parseTeamPage(responseString);
      callback(players);
    });
  });

  request.end();
  request.on('error', function(e) {
    console.log(e);
    callback(e);
  });
};

parser.parseTeamPage = function(html) {
  var $ = cheerio.load(html);

  var players = [];

  var rows = $('tbody').find('a');
  rows.each(function(i, elem) {
    var name = $(this).text();
    var salary = $(this).parent().next().text();
    players.push({
      name: name,
      salary: salary
    });
  });

  players = players.filter(function(player) {
    return player.name.indexOf(')') === -1;
  });

  players = parser.sanitizePlayers(players);

  var total = $('tbody').children().last().children().next().html();

  return {
    totalSalary: total,
    players: players
  };
};

parser.sanitizePlayers = function(players) {
  return players.map(function(player) {
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
    player.imageUrl = '/images/' + player.imageUrl + '.jpg';

    return player;
  });
};
