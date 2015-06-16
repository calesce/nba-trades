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
      selectedTeams: [],
      incomingPlayers: [[], [], [], []],
      outgoingPlayers: [[], [], [], []]
    };
  }

  handleInitialPayload = (teams) => {
    this.setState({
      teams,
      selectedTeams: [ teams.Warriors, teams.Cavaliers, teams.Grizzlies, teams.Hornets ],
      incomingPlayers: [[], [], [], []],
      outgoingPlayers: [[], [], [], []]
    });
  }

  handleTeamSelected = ({ teamName, teamNumber }) => {
    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    if(teamName === 'none') {
      if(this.state.selectedTeams.length < 3) {
        return;
      }

      selectedTeams = _.filter(selectedTeams, (name, index) => index !== teamNumber );
    }
    else {
      selectedTeams[teamNumber] = this.state.teams[teamName];
    }

    this.setState({ selectedTeams });
    this.setState({
      incomingPlayers: [[], [], [], []],
      outgoingPlayers: [[], [], [], []]
    });
  }

  handlePlayerSelected = ({ player, teamName }) => {
    const teamIndex = _.findIndex(this.state.selectedTeams, (team) => team.teamName === teamName);
    const playerTeamIndex = _.findIndex(this.state.selectedTeams, (team) => team.teamName === player.team);
    let incomingPlayers = _.cloneDeep(this.state.incomingPlayers);
    let outgoingPlayers = _.cloneDeep(this.state.outgoingPlayers);

    incomingPlayers[teamIndex].push(player);
    outgoingPlayers[playerTeamIndex].push(player);

    this.setState({ incomingPlayers, outgoingPlayers });

    /*let isPlayerAlreadySelected = _.findIndex(this.state.incomingPlayers[teamIndex], (existingPlayer) => {
      return existingPlayer.name === player.name;
    });

    if(isPlayerAlreadySelected === -1) {
      incomingPlayers[teamIndex].push(player);
      this.setState({ incomingPlayers });
    }*/
    // TODO handle case where player is removed
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
