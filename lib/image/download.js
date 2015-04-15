var fs = require('fs');
var path = require('path');
var http = require('http');
var async = require('async');
var rimraf = require('rimraf');

function getTeamIds(callback) {
  var filePath = path.join(__dirname, './teams.json');

  fs.readFile(filePath, 'utf8', function(err, data) {
    if(err) {
      callback(err, null);
      return;
    }

    callback(null, JSON.parse(data).map(function(team) {
      return team.teamId;
    }));

    return;
  });
}

function individualTeamRoster(teamId, callback) {
  var options = {
    host: 'stats.nba.com',
    method: 'GET',
    path: '/stats/commonteamroster?LeagueID=00&Season=2014-15&TeamID=' + teamId
  };

  var data = '';

  var request = http.request(options, function(response) {

    response.setEncoding('utf8');

    response.on('data', function(chunk) {
      data += chunk;
    });

    response.on('end', function(err) {
      if(err) {
        callback(err, null);
      }

      var roster = JSON.parse(data).resultSets[0].rowSet.map(function(player) {
        return player[3];
      });

      callback(null, roster);
      return;
    });
  });

  request.end();
  request.on('error', function(err) {
    callback(err, null);
  });
}

function getRosterForTeams(cb) {

  getTeamIds(function(e, teams) {
    var rosters = [];

    async.eachSeries(teams, function(team, asyncCallback) {

      individualTeamRoster(team, function(err, roster) {
        if(err) {
          cb(err);
          return;
        }

        rosters.push(roster);
        asyncCallback();
      });
    }, function(err) {
      if(err) {
        cb(err, null);
        return;
      }

      rosters = rosters.map(function(roster) {
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

      cb(null, rosters);
      return;
    });
  });
}

function downloadImage(playerName, dest, callback) {
  var url = 'http://i.cdn.turner.com/nba/nba/media/playerfile/' + playerName + '.jpg';

  http.get(url, function(response) {

    if(response.statusCode !== 200) {
      console.log(playerName + ' not found.');

      //TODO add blank player image
    }

    var file = fs.createWriteStream(dest);

    response.pipe(file);

    file.on('finish', function() {
      file.close(callback);
    }).on('error', function(err) {
      fs.unlink(dest);

      callback(err);
    });
  }).on('error', function(err) {
    callback(err);
  });
}

function downloadForEachRoster(roster, callback) {
  async.each(roster, function(player, asyncCb) {

    downloadImage(player, (path.join(__dirname, '../../images') + '/' + player + '.jpg'), function(err) {
      if(err) {
        asyncCb(err);
        return;
      }

      asyncCb();
    });
  }, function(err) {
    if(err) {
      callback(err);
      return;
    }

    callback();
  });
}

function getAllImages(rosters, callback) {

  fs.mkdir(path.join(__dirname, '../../images'), function() {

    async.each(rosters, downloadForEachRoster, function(err) {
      if(err) {
        callback(err);
        return;
      }

      callback();
    });
  });
}

function removeFilesThenDownload(rosters, cb) {

  rimraf(path.join(__dirname, '../../images'), function() {
    getAllImages(rosters, function(err) {
      if(err) {

        cb(err);
        return;
      }

      cb();
    });
  });
}

exports.fetch = function(cb) {

  getRosterForTeams(function(err, rosters) {

    if(err) {
      cb(err);
      return;
    }

    removeFilesThenDownload(rosters, function(error) {

      if(error) {
        cb(error);
        return;
      }

      cb();
      return;
    });
  });
};
