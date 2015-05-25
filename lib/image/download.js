var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var request = require('request-promise');
var _ = require('lodash');
var rimraf = Promise.promisify(require('rimraf'));
var rosterData = require('./roster');

function downloadImage(playerName) {
  var dest = path.join(__dirname, '../../images') + '/' + playerName + '.jpg';
  var url = 'http://i.cdn.turner.com/nba/nba/media/playerfile/' + playerName + '.jpg';

  return new Promise(function(resolve, reject) {
    var file = fs.createWriteStream(dest);

    request.get(url)
      .on('error', function(err) {
        console.log(err);
        reject(err);
      })
      .on('response', function(response) {
        if(response.statusCode === 404) {
          console.log('404 - ' + playerName);
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
      return downloadImage(player);
    });
  }));

  return Promise.all(promises)
    .catch(function(err) {
      throw err;
    });
}

module.exports = function() {

  return rimraf(path.join(__dirname, '../../images'))
    .then(function() {
      return fs.mkdir(path.join(__dirname, '../../images'));
    })
    .then(function() {
      return rosterData.getRosters();
    })
    .then(function(rosters) {
      return getAllImages(rosters);
    })
    .catch(function(err) {
      throw err;
    });
};
