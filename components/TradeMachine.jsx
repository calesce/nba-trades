import React, { PropTypes } from 'react';
import _ from 'lodash';

import TeamArea from './TeamArea.jsx';
import Check from './Check.jsx';

export default class TradeMachine extends React.Component {

  constructor(props) {
    super(props);

    let team1 = this.getTeam('Wizards');
    let team2 = this.getTeam('Grizzlies');

    this.state = {
      selectedTeams: {
        team1,
        team2
      },
      incomingPlayers: {
        team1: [],
        team2: []
      }
    };

    this.handleTeamSelected = this.handleTeamSelected.bind(this);
    this.handlePlayerClicked = this.handlePlayerClicked.bind(this);
    this.getTeamForPlayer = this.getTeamForPlayer.bind(this);
    this.getTeam = this.getTeam.bind(this);
    this.getPlayerIndex = this.getPlayerIndex.bind(this);
    this.getFilteredTeams = this.getFilteredTeams.bind(this);
  }

  handleTeamSelected(team, index) {
    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    selectedTeams[index] = this.props.teams[team];

    // change to new teams and clear out staged players
    this.setState({
      selectedTeams,
      incomingPlayers: {
        team1: [],
        team2: []
      }
    });
  }

  handlePlayerClicked(player) {
    if(this.state.selectedTeams.team1 === '' || this.state.selectedTeams.team2 === '') {
      return;
    }

    let teamIndex = this.getTeamForPlayer(player.name) === this.state.selectedTeams.team1.teamName ? 'team2' : 'team1';
    let incomingPlayers = _.cloneDeep(this.state.incomingPlayers);

    let isPlayerAlreadySelected = _.findIndex(this.state.incomingPlayers[teamIndex], (existingPlayer) => {
      return existingPlayer.name === player.name;
    });

    if(isPlayerAlreadySelected === -1) {
      incomingPlayers[teamIndex].push(player);
      this.setState({ incomingPlayers });
    }
    else {
      var index = _.findIndex(incomingPlayers[teamIndex], 'name', player.name);
      incomingPlayers[teamIndex].splice(index, 1);

      this.setState({ incomingPlayers });
    }
  }

  getTeamForPlayer(playerName) {
    let teams = this.props.teams;

    return _.compact(_.map(teams, (team, key) => {
      if(_.findIndex(team.players, 'name', playerName) !== -1) {
        return key;
      }
    }))[0];
  }

  getTeam(teamName) {
    return this.props.teams[teamName];
  }

  getPlayerIndex(playerName, teamName) {
    let teamPlayers = this.props.teams[teamName].players;

    return _.findIndex(teamPlayers, (player) => {
      return player.name === playerName;
    });
  }

  getFilteredTeams(index) {
    if(this.state.selectedTeams.team1) {
      let teams = _.cloneDeep(this.props.teams);
      let filteredIndex = (index === 'team1') ? 'team2' : 'team1';
      return _.omit(teams, this.state.selectedTeams[filteredIndex].teamName);
    }
    else {
      return this.props.teams;
    }
  }

  render() {
    let style = {
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      cursor: 'default'
    };

    return (
      <div style={style} className='TradeMachine'>
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
    );
  }
}

TradeMachine.propTypes = {
  teams: PropTypes.object
};
