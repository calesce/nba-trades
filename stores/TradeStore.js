import { Store } from 'flummox';

export default class TradeStore extends Store {

  constructor(flux) {
    super();

    const payloadActionIds = flux.getActionIds('payload');
    this.register(payloadActionIds.getData, this.handlePayload);

    this.state = {
      teams: []
    };
  }

  handlePayload = (teams) => {
    console.log(this);
    this.setState({ teams: teams });
  }

  getTeams = () => {
    return this.state.teams;
  }
}
