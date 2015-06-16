// Load modules
var salaries = require('./salaries');

module.exports = function(req, res) {

  salaries().then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.error(err);
  });
};
