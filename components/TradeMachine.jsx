var React = require('react');
var _ = require('lodash');
var TeamArea = require('./TeamArea.jsx');

var TradeMachine = React.createClass({
  getInitialState: function() {
    return {
      selectedTeams: {
        first: '',
        second: ''
      },
      incomingPlayers: ''
    };
  },
  handleTeamSelected: function(team, index) {
    var newSelectedTeams = _.assign({}, this.state.selectedTeams);
    newSelectedTeams[index] = team;
    this.setState({ selectedTeams: newSelectedTeams });
  },
  handlePlayerMove: function() {
    // TODO if two teams, on a player being clicked, his card should be added to the other team's incoming area
  },
  componentDidMount: function() {
    
  },
  componentWillUnmount: function() {
    
  },
  getFilteredTeams: function(index) {
    var teams = _.assign({}, this.props.teams);
    var filteredIndex = (index === 'first') ? 'second' : 'first';
    var filteredTeam = this.state.selectedTeams[filteredIndex];
    
    return _.omit(teams, filteredTeam);
  },
  render: function() {
    if(this.props.teams) {
      return (
        <div className='TradeMachine'>
          <TeamArea teams={this.getFilteredTeams('first')} class='area1' number={'first'} onTeamSelected={this.handleTeamSelected} />
          <TeamArea teams={this.getFilteredTeams('second')} class='area2' number={'second'} onTeamSelected={this.handleTeamSelected} />
        </div>
      );
    }
    else {
      return <div></div>;
    }
  }
});

module.exports = TradeMachine;