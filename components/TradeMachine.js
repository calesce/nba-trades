var React = require('react');
var _ = require('lodash');
var TeamArea = require('./TeamArea.js');

var TradeMachine = React.createClass({
  getInitialState() {
    return {
      selectedTeams: {
        team1: '',
        team2: ''
      },
      incomingPlayers: {
        team1: [],
        team2: []
      }
    };
  },
  handleTeamSelected(team, index) {
    var newSelectedTeams = _.assign({}, this.state.selectedTeams);
    newSelectedTeams[index] = team;
    
    // change to new teams and clear out staged players
    this.setState({ 
      selectedTeams: newSelectedTeams,
      incomingPlayers: {
        team1: [],
        team2: []
      }
    });
  },
  handlePlayerClicked(e) {
    console.log(e.target);
    
    if(this.state.selectedTeams.team1 === '' || this.state.selectedTeams.team2 === '') {
      return;
    }
    
    var playerName = e.target.innerHTML;
    var teamGivingPlayer = this.getTeamForPlayer(e.target.innerHTML);
    
    var teamReceivingPlayer = (teamGivingPlayer === this.state.selectedTeams.team1)? 'team2': 'team1';
    
    var newIncomingPlayers = _.assign({}, this.state.incomingPlayers);
    if(_.indexOf(this.state.incomingPlayers[teamReceivingPlayer], playerName) === -1) {
      newIncomingPlayers[teamReceivingPlayer].push(playerName);
      
      this.setState({
        incomingPlayers: newIncomingPlayers
      });
    }
  },
  getTeamForPlayer(playerName) {
    var teams = this.props.teams;
    
    return _.compact(_.map(teams, (team, key) => {
      if(_.findIndex(team.players, 'name', playerName) !== -1) {
        return key;
      }
    }))[0];
  },
  componentDidMount() {
    
  },
  componentWillUnmount() {
    
  },
  getFilteredTeams(index) {
    var teams = _.assign({}, this.props.teams);
    var filteredIndex = (index === 'team1') ? 'team2' : 'team1';
    
    return _.omit(teams, this.state.selectedTeams[filteredIndex]);
  },
  render() {
    if(this.props.teams) {
      return (
        <div className='TradeMachine'>
          <TeamArea
            teams={this.getFilteredTeams('team1')}
            class='area1' number={'team1'}
            onTeamSelected={this.handleTeamSelected}
            onPlayerClicked={this.handlePlayerClicked}
            incomingPlayers={this.state.incomingPlayers.team1}
          />
          <TeamArea
            teams={this.getFilteredTeams('team2')}
            class='area2' number={'team2'}
            onTeamSelected={this.handleTeamSelected}
            onPlayerClicked={this.handlePlayerClicked}
            incomingPlayers={this.state.incomingPlayers.team2}
          />
        </div>
      );
    }
    else {
      return <div></div>;
    }
  }
});

module.exports = TradeMachine;