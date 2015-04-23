var http = require('http'),
  async = require('async'),
  cheerio = require('cheerio');

var options = {
  host: 'data.shamsports.com',
  path: '/content/pages/data/salaries/hawks.jsp',
  method: 'GET'
};

var theTeamNames = ['hawks', 'celtics', 'nets', 'hornets', 'bulls', 'cavaliers',
             'mavericks', 'nuggets', 'pistons', 'warriors', 'rockets', 'pacers',
             'clippers', 'lakers', 'grizzlies', 'heat', 'bucks', 'timberwolves',
             'pelicans', 'knicks', 'thunder', 'magic', 'sixers', 'suns', 'blazers',
             'kings', 'spurs', 'raptors', 'jazz', 'wizards'];

exports.collectTeamData = function(callback) {
  var teams = {};

  async.eachSeries(theTeamNames, addTeam, allAdded);

  function addTeam(team, asyncCallback) {
    grabTeamHtml(team, function(teamData) {
      if(teamData) {
        teams[team] = teamData;
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

    teams.rockets.players[16].salary = '$507,336';
    teams.heat.players[2].salary = '$5,300,000';
    teams.heat.players[5].salary = '$2,732,000';
    teams.wizards.players[8].salary = '$4,250,000';

    callback(teams);
  }
};


function grabTeamHtml(team, callback) {
  options.path = '/content/pages/data/salaries/' + team + '.jsp';

  var request = http.request(options, function(response) {
    response.setEncoding('utf8');

    var responseString = '';

    response.on('data', function(chunk) {
      responseString += chunk;
    });

    response.on('end', function() {
      var players = parseTeamPage(responseString);
      if(players) {

        callback(players);
      }
      else {
        console.log('error');
        callback('none');
      }
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

  // Gets the table with salary sheet on it
  var main = $('#main').children().eq(17);

  main = main.children().next();

  var players = [];
  var len = main.length;
  for(var i = 0; i < len - 2; i++) {
    var playerName = main.children().children().children().html().replace(/\s+/g, ' ');
    var salary = main.children().next().children().html();
    players.push({
      name: playerName,
      salary: salary
    });

    main = main.next();
  }

  var totalSalary = main.children().next().children().html();

  return {
    totalSalary: totalSalary,
    players: players
  };
}
