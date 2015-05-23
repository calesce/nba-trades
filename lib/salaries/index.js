// Load modules
var salaries = require('./salaries');

module.exports = function(req, res) {

  salaries(function(err, data) {
    if(err) {
      res.error(err);
    }

    res.send(data);
  });
};
