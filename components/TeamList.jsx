var React = require('react');
var Player = require('./Player.jsx');
var _ = require('lodash');

var TeamList = React.createClass({
  render: function() {
    var roster = _.cloneDeep(this.props.team.players);
    
    return (
      <div>
        { 
          roster.map(function(player) {
            return <Player key={player.name} name={player.name} salary={player.salary} onPlayerClicked={this.props.onPlayerClicked} />;
          }.bind(this))
        }
        <br />
        <br />
        <div>Team Salary: { this.props.team.totalSalary }</div>
      </div>
    );
  }
});

module.exports = TeamList;