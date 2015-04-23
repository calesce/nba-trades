var React = require('react');
var _ = require('lodash');
var TeamArea = require('./TeamArea.jsx');
var Check = require('./Check.jsx');

var TradeMachine = React.createClass({
  getInitialState() {
    let team1 = this.getTeam('Pelicans');
    let team2 = this.getTeam('Grizzlies');

    return {
      selectedTeams: {
        team1: team1,
        team2: team2
      },
      incomingPlayers: {
        team1: [],
        team2: []
      }
    };
  },
  handleTeamSelected(team, index) {
    var newSelectedTeams = _.cloneDeep(this.state.selectedTeams);
    newSelectedTeams[index] = this.props.teams[team];

    // change to new teams and clear out staged players
    this.setState({
      selectedTeams: newSelectedTeams,
      incomingPlayers: {
        team1: [],
        team2: []
      }
    });
  },
  handlePlayerClicked(player) {
    if(this.state.selectedTeams.team1 === '' || this.state.selectedTeams.team2 === '') {
      return;
    }

    var teamIndex = this.getTeamForPlayer(player.name) === this.state.selectedTeams.team1.teamName ? 'team2' : 'team1';

    var newIncomingPlayers = _.cloneDeep(this.state.incomingPlayers);

    var isPlayerAlreadySelected = _.findIndex(this.state.incomingPlayers[teamIndex], (existingPlayer) => {
      return existingPlayer.name === player.name;
    });

    if(isPlayerAlreadySelected === -1) {
      newIncomingPlayers[teamIndex].push(player);
      this.setState({
        incomingPlayers: newIncomingPlayers
      });
    }
    else {
      var index = _.findIndex(newIncomingPlayers[teamIndex], 'name', player.name);
      newIncomingPlayers[teamIndex].splice(index, 1);

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
  getTeam(teamName) {
    return this.props.teams[teamName];
  },
  getPlayerIndex(playerName, teamName) {
    var teamPlayers = this.props.teams[teamName].players;

    return _.findIndex(teamPlayers, (player) => {
      return player.name === playerName;
    });
  },
  getFilteredTeams(index) {
    if(this.state.selectedTeams.team1) {
      var teams = _.cloneDeep(this.props.teams);
      var filteredIndex = (index === 'team1') ? 'team2' : 'team1';
      return _.omit(teams, this.state.selectedTeams[filteredIndex].teamName);
    }
    else {
      return this.props.teams;
    }
  },
  render() {
    if(this.props.teams) {
      return (
        <div className='TradeMachine'>
          <TeamArea
            teams={this.getFilteredTeams('team1')}
            team={this.state.selectedTeams.team1}
            number={'team1'}
            onTeamSelected={this.handleTeamSelected}
            onPlayerClicked={this.handlePlayerClicked}
            incomingPlayers={this.state.incomingPlayers.team1}
            outgoingPlayers={this.state.incomingPlayers.team2}
          />
          <TeamArea
            teams={this.getFilteredTeams('team2')}
            team={this.state.selectedTeams.team2}
            number={'team2'}
            onTeamSelected={this.handleTeamSelected}
            onPlayerClicked={this.handlePlayerClicked}
            incomingPlayers={this.state.incomingPlayers.team2}
            outgoingPlayers={this.state.incomingPlayers.team1}
          />
        </div>
        // <Check
        //   incoming={this.state.incomingPlayers}
        //   teams={this.state.selectedTeams}
        //   salaryCap={this.props.salaryCap}
        //   taxLine={this.props.taxLine}
        // />

      );
    }
    else {
      return <div></div>;
    }
  }
});

module.exports = TradeMachine;
