import { Store } from 'flummox';
import _ from 'lodash';

export default class TradeStore extends Store {

  constructor(flux) {
    super();

    const tradeActionIds = flux.getActionIds('trade');
    this.register(tradeActionIds.getData, this.handleInitialPayload);
    this.register(tradeActionIds.teamSelected, this.handleTeamSelected);
    this.register(tradeActionIds.playerSelected, this.handlePlayerSelected);
    this.register(tradeActionIds.playerRemoved, this.handlePlayerRemoved);
    this.register(tradeActionIds.teamRemoved, this.handleTeamRemoved);
    this.register(tradeActionIds.teamAdded, this.handleTeamAdded);

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
      selectedTeams: [ teams.Warriors, teams.Cavaliers ],
      incomingPlayers: [[], [], [], []],
      outgoingPlayers: [[], [], [], []],
      validity: undefined
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

    let alreadyAddedIndex = _.findIndex(this.state.incomingPlayers, (players) => {
      var selected = false;

      players.forEach((existingPlayer) => {
        if(existingPlayer.name === player.name) {
          selected = true;
        }
      });

      return selected;
    });

    if(alreadyAddedIndex !== -1) {
      if(alreadyAddedIndex === teamIndex) {
        return;
      }
      else {
        const alreadyAddedPlayerIndex = _.findIndex(incomingPlayers[alreadyAddedIndex], (thePlayer) => thePlayer.name === player.name);
        incomingPlayers[alreadyAddedIndex].splice(alreadyAddedPlayerIndex, 1);
      }
    }
    else {
      // max length of 15 players
      if(incomingPlayers[teamIndex].length === 15) {
        return;
      }

      outgoingPlayers[playerTeamIndex].push(player);
    }

    incomingPlayers[teamIndex].push(player);

    this.setState({ incomingPlayers, outgoingPlayers });
  }

  handlePlayerRemoved = (player) => {
    let incomingPlayers = _.cloneDeep(this.state.incomingPlayers);
    let outgoingPlayers = _.cloneDeep(this.state.outgoingPlayers);

    const playerTeamIndex = _.findIndex(this.state.selectedTeams, (team) => team.teamName === player.team);
    const outgoingPlayerIndex = _.findIndex(outgoingPlayers[playerTeamIndex], (outgoingPlayer) => player.name === outgoingPlayer.name);
    let incomingPlayerIndex;
    const incomingTeamIndex = _.findIndex(incomingPlayers, (players) => {
      var selected = false;

      players.forEach((existingPlayer, index) => {
        if(existingPlayer.name === player.name) {
          selected = true;
          incomingPlayerIndex = index;
        }
      });

      return selected;
    });

    if(outgoingPlayerIndex !== -1) {
      outgoingPlayers[playerTeamIndex].splice(outgoingPlayerIndex, 1);
      incomingPlayers[incomingTeamIndex].splice(incomingPlayerIndex, 1);
    }

    this.setState({ incomingPlayers, outgoingPlayers });
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

  handleTeamRemoved = (teamNumber) => {
    if(this.state.selectedTeams.length <= 2) {
      return;
    }

    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    selectedTeams.splice(teamNumber, 1);

    this.setState({ selectedTeams });
    this.setState({
      incomingPlayers: [[], [], [], []],
      outgoingPlayers: [[], [], [], []]
    });
  }

  handleTeamAdded = () => {
    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    let teamToAdd = this.getFirstTeamNotSelected();

    selectedTeams.push(teamToAdd);
    this.setState({ selectedTeams });
  }

  getFirstTeamNotSelected = () => {
    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    let existingTeamNames = _.map(selectedTeams, (team) => team.teamName);

    let teams = _.cloneDeep(this.state.teams);
    let allTeamNames = _.chain(teams)
      .sortBy((team) => team.location)
      .map((team) => team.teamName)
      .filter((teamName) => {
        return _.findIndex(existingTeamNames, (name) => teamName === name) === -1;
      })
      .value();

    return this.state.teams[allTeamNames[0]];
  }

  salaryToNumber = (salaryString) => {
    return parseInt(salaryString.replace(/\$|\,/g, ''));
  }

  isTrade = (incoming) => {
    let check = 0;

    _.forEach(incoming, (incomingPlayer) => {
      if(incomingPlayer.length > 0) {
        ++check;
      }
    });

    return check > 0;
  }
}
