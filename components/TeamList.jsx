var React = require('react');
var Player = require('./Player.jsx');

var TeamList = React.createClass({
  render: function() {
    return (
      <div>
        { 
          this.props.team.players.map(function(player) {
            return <Player key={player.name} data={player} />;
          })
        }
        <div>Team Salary: { this.props.team.totalSalary }</div>
      </div>
    );
  }
});

module.exports = TeamList;