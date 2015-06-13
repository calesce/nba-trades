import { Store } from 'flummox';
import _ from 'lodash';

export default class TradeStore extends Store {

  constructor(flux) {
    super();

    const tradeActionIds = flux.getActionIds('trade');
    this.register(tradeActionIds.getData, this.handleInitialPayload);
    this.register(tradeActionIds.teamSelected, this.handleTeamSelected);
    this.register(tradeActionIds.playerSelected, this.handlePlayerSelected);

    this.state = {
      teams: [],
      selectedTeams: {},
      incomingPlayers: {}
    };
  }

  handleInitialPayload = (teams) => {
    this.setState({
      teams,
      selectedTeams: {
        team1: teams.Warriors,
        team2: teams.Cavaliers
      },
      incomingPlayers: {
        team1: [],
        team2: []
      }
    });
  }

  handleTeamSelected = ({ teamName, teamNumber }) => {
    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    selectedTeams[teamNumber] = this.state.teams[teamName];

    this.setState({ selectedTeams });
    this.setState({
      incomingPlayers: {
        team1: [],
        team2: []
      }
    });
  }

  handlePlayerSelected = (player) => {
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
      let index = _.findIndex(incomingPlayers[teamIndex], 'name', player.name);
      incomingPlayers[teamIndex].splice(index, 1);

      this.setState({ incomingPlayers });
    }
  }

  getTeamForPlayer = (playerName) => {
    let teams = this.state.teams;

    return _.compact(_.map(teams, (team, key) => {
      if(_.findIndex(team.players, 'name', playerName) !== -1) {
        return key;
      }
    }))[0];
  }

  getTeams = () => {
    return this.state.teams;
  }
}
