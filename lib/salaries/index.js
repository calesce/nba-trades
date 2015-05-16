// Load modules
var parse = require('./parse');

exports.getTeams = function(req, res) {

  parse.collectTeamData(function(err, data) {
    if(err) {
      res.error(err);
    }

    res.send(data);
  });
};
