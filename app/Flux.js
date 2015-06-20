import { Flummox } from 'flummox';
import TradeActions from './actions/TradeActions';
import TradeStore from './stores/TradeStore';

export default class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('trade', TradeActions);
    this.createStore('trade', TradeStore, this);
  }
}
