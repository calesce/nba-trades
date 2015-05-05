var http = require('http'),
  async = require('async'),
  cheerio = require('cheerio'),
  teamsData = require('./teams');

var options = {
  host: 'hw-files.com',
  method: 'GET'
};

exports.collectTeamData = function(callback) {
  var teams = {};

  var teamsList = teamsData.map(function(team) {
    return team.teamName;
  });

  async.eachSeries(teamsList, addTeam, allAdded);

  function addTeam(team, asyncCallback) {
    var index = teamsList.indexOf(team) + 1;

    grabTeamHtml(index, function(teamData) {
      if(teamData) {
        teams[team] = teamData;
        teams[team].teamName = team;
        teams[team].location = getLocation(team, teamsData);
      }
      else {
        asyncCallback('error: team data not available');
      }
      asyncCallback();
    });
  }

  function allAdded(err) {
    if (err) {
      callback(err);
    }

    callback(teams);
  }
};

function getLocation(teamName, data) {
  return data.filter(function(team) {
    return team.teamName === teamName;
  })[0].location;
}

function grabTeamHtml(id, callback) {
  options.path = '/tools/salaries/salaries_widget_new.php?team_id=' + id;

  var request = http.request(options, function(response) {
    response.setEncoding('utf8');

    var responseString = '';

    response.on('data', function(chunk) {
      responseString += chunk;
    });

    response.on('end', function() {
      var players = parseTeamPage(responseString);
      callback(players);
    });
  });

  request.end();
  request.on('error', function(e) {
    console.log(e);
    callback(e);
  });
}

function parseTeamPage(html) {
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

  players = sanitizePlayers(players);

  var total = $('tbody').children().last().children().next().html();

  return {
    totalSalary: total,
    players: players
  };
}

function sanitizePlayers(players) {
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
}
