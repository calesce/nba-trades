var React = require('react');
var TeamList = require('./TeamList.jsx');

var TeamArea = React.createClass({
  getInitialState: function() {
    return {
      selectedTeam: null,
      outgoingPlayers: null,
      incomingPlayers: null
    };
  },
  teamSelected: function(event) {
    this.setState({ selectedTeam: event.target.value });
    
    this.props.onTeamSelected(event.target.value, this.props.number);
  },
  render: function() {
    var selected = false;
    if(this.state.selectedTeam) {
      selected = true;
    }
    var teams = this.props.teams
    var incoming = this.props.incomingPlayers
    
    return (
      <div className={this.props.class} >
        <select onChange={this.teamSelected}>
          <option value='hey'>Choose a team</option>
          { Object.keys(teams).map(function(team, index) {
              return <option key={team} value={team}>{team}</option>
            })
          }
        </select>
        { selected ? 
          <div>
            <TeamList team={teams[this.state.selectedTeam]} onPlayerClicked={this.props.onPlayerClicked} />
            <br />
            <br />
            <div>Incoming Players:</div>
          </div>
          : 
          <div></div>
        }
            {
            incoming.map(function(player) {
              return <div>{player}</div>
            })}
      </div>
    );
  }
});

module.exports = TeamArea;