var React = require('react');
var _ = require('lodash');
var TeamArea = require('./TeamArea.jsx');

var TradeMachine = React.createClass({
  getInitialState: function() {
    return {
      selectedTeams: {
        team1: '',
        team2: ''
      },
      incomingPlayers: ''
    };
  },
  handleTeamSelected: function(team, index) {
    var newSelectedTeams = _.assign({}, this.state.selectedTeams);
    newSelectedTeams[index] = team;
    this.setState({ selectedTeams: newSelectedTeams });
  },
  handlePlayerClicked: function(e) {
    // TODO if two teams, on a player being clicked, his card should be added to the other team's incoming area
    console.log(e.target);
  },
  componentDidMount: function() {
    
  },
  componentWillUnmount: function() {
    
  },
  getFilteredTeams: function(index) {
    var teams = _.assign({}, this.props.teams);
    var filteredIndex = (index === 'team1') ? 'team2' : 'team1';
    
    return _.omit(teams, this.state.selectedTeams[filteredIndex]);
  },
  render: function() {
    if(this.props.teams) {
      return (
        <div className='TradeMachine'>
          <TeamArea teams={this.getFilteredTeams('team1')} class='area1' number={'team1'} onTeamSelected={this.handleTeamSelected} onPlayerClicked={this.handlePlayerClicked} />
          <TeamArea teams={this.getFilteredTeams('team2')} class='area2' number={'team2'} onTeamSelected={this.handleTeamSelected} onPlayerClicked={this.handlePlayerClicked} />
        </div>
      );
    }
    else {
      return <div></div>;
    }
  }
});

module.exports = TradeMachine;