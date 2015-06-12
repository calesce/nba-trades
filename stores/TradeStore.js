import { Store } from 'flummox';
import _ from 'lodash';

export default class TradeStore extends Store {

  constructor(flux) {
    super();

    const tradeActionIds = flux.getActionIds('trade');
    this.register(tradeActionIds.getData, this.handleInitialPayload);
    this.register(tradeActionIds.teamSelected, this.handleTeamSelected);

    this.state = {
      teams: [],
      selectedTeams: {}
    };
  }

  handleInitialPayload = (teams) => {
    this.setState({
      teams,
      selectedTeams: {
        team1: teams.Warriors,
        team2: teams.Cavaliers
      }
    });
  }

  handleTeamSelected = ({ teamName, teamNumber }) => {
    let selectedTeams = _.cloneDeep(this.state.selectedTeams);
    selectedTeams[teamNumber] = this.state.teams[teamName];

    this.setState({ selectedTeams });
  }

  getTeams = () => {
    return this.state.teams;
  }
}
