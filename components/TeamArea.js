var React = require('react');
var TeamList = require('./TeamList.js');

var TeamArea = React.createClass({
  getInitialState() {
    return {
      selectedTeam: null,
      outgoingPlayers: null,
      incomingPlayers: null
    };
  },
  teamSelected(event) {
    this.setState({ selectedTeam: event.target.value });
    
    this.props.onTeamSelected(event.target.value, this.props.number);
  },
  render() {
    var selected = false;
    if(this.state.selectedTeam) {
      selected = true;
    }
    var teams = this.props.teams;
    var incoming = this.props.incomingPlayers;
    var teamNames = Object.keys(teams);
    
    return (
      <div className={this.props.class} >
        <select onChange={this.teamSelected}>
          <option value='' disabled>Choose a team</option>
          { teamNames.map((team, index) => {
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
            incoming.map((player) => {
              return <div>{player.name} - {player.salary}</div>
            })}
      </div>
    );
  }
});

module.exports = TeamArea;