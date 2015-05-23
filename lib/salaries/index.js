// Load modules
var parse = require('./salaries');

exports.getTeams = function(req, res) {

  parse.checkIfCached(function(err, data) {
    if(err) {
      res.error(err);
    }

    res.send(data);
  });
};
