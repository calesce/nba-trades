import { Store } from 'flummox';

export default class TradeStore extends Store {

  constructor(flux) {
    super();

    const tradeActionIds = flux.getActionIds('trade');
    this.register(tradeActionIds.getData, this.handleInitialPayload);

    this.state = {
      teams: [],
      selectedTeams: {}
    };
  }

  handleInitialPayload = (teams) => {
    this.setState({ teams: teams });
  }

  getTeams = () => {
    return this.state.teams;
  }
}
