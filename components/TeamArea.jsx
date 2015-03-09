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
    
    return (
      <div className={this.props.class} >
        <select onChange={this.teamSelected}>
          <option value='hey'>Choose a team</option>
          { Object.keys(this.props.teams).map(function(team, index) {
              return <option key={team} value={team}>{team}</option>
            })
          }
        </select>
        { selected ? 
          <div>
            <TeamList team={this.props.teams[this.state.selectedTeam]} />
            <div>Incoming Players:</div>
          </div>
          : 
          <div></div>
        }
      </div>
    );
  }
});

module.exports = TeamArea;