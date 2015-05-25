var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var rimraf = require('rimraf');
var roster = require('./roster');

function downloadImage(playerName, cb) {
  var dest = path.join(__dirname, '../../images') + '/' + playerName + '.jpg';

  var file = fs.createWriteStream(dest);

  request('http://i.cdn.turner.com/nba/nba/media/playerfile/' + playerName + '.jpg')
    .on('response', function(response) {
      if(response.statusCode !== 200) {
        console.log(response.statusCode + ' - ' + playerName);
      }
    })
    .on('error', function(err) {
      fs.unlink(dest);
      return cb(err);
    })
    .pipe(file);

  file.on('finish', function() {
    file.close(cb);
  });
}

function downloadForEachRoster(theRoster, cb) {
  async.each(theRoster, function(player, asyncCb) {

    downloadImage(player, function(err) {
      if(err !== 'error downloading') {
        return asyncCb(err);
      }

      return asyncCb();
    });
  }, function(err) {
    if(err) {
      return cb(err);
    }
    else {
      return cb();
    }
  });
}

function getAllImages(rosters, cb) {

  fs.mkdir(path.join(__dirname, '../../images'), function() {

    async.eachLimit(rosters, 15, downloadForEachRoster, function(err) {
      if(err) {
        return cb(err);
      }

      return cb();
    });
  });
}

exports.fetch = function(cb) {

  roster.getRosterForTeams(function(err, rosters) {

    if(err) {
      return cb(err);
    }

    rimraf(path.join(__dirname, '../../images'), function() {

      getAllImages(rosters, function(error) {
        if(error) {
          return cb(error);
        }

        return cb();
      });
    });
  });
};
