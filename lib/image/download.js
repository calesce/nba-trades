var Promise = require('bluebird');
var FileQueue = Promise.promisifyAll(require('filequeue'));
var path = require('path');
var request = require('request-promise');
var _ = require('lodash');
var rimraf = Promise.promisify(require('rimraf'));
var rosterData = require('./roster');

var fq = new FileQueue(200);

function downloadImage(playerName, url) {
  var dest = path.join(__dirname, '../../app/assets/images') + '/' + playerName + '.jpg';

  return new Promise(function(resolve, reject) {
    var file = fq.createWriteStream(dest);

    request.get(url)
      .on('error', function(err) {
        reject(err);
      })
      .on('response', function(response) {
        if(response.statusCode === 404) {
          return resolve(playerName);
        }
      })
      .pipe(file);

    file.on('error', function(err) {
      reject(err);
    });

    file.on('finish', function() {
      resolve();
    });
  });
}

function getAllImages(rosters) {
  var promises = _.flattenDeep(rosters.map(function(theRoster) {
    return theRoster.map(function(player) {
      var url = 'http://i.cdn.turner.com/nba/nba/media/playerfile/' + player + '.jpg';
      return downloadImage(player, url);
    });
  }));

  return Promise.filter(promises, function(playerName) {
    if(playerName) {
      return playerName;
    }
  }).catch(function(err) {
      throw err;
    });
}

function getEmptyImages(players) {
  var promises = players.map(function(player) {
    return downloadImage(player, 'http://aspireeducation.org/wp-content/uploads/2013/02/empty_profile.jpg');
  });

  return Promise.all(promises)
    .catch(function(err) {
      throw err;
    });
}

module.exports = function() {
  return rimraf(path.join(__dirname, '../../app/assets/images'))
    .then(function() {
      return fq.mkdir(path.join(__dirname, '../../app/assets/images'));
    })
    .then(function() {
      return rosterData.getRosters();
    })
    .then(function(rosters) {
      return getAllImages(rosters);
    })
    .then(function(playerNames) {
      console.log(playerNames);
      return getEmptyImages(playerNames);
    })
    .catch(function(err) {
      throw err;
    });
};
