import { Flummox } from 'flummox';
import PayloadActions from './actions/Payload';
import TradeStore from './stores/TradeStore';

export default class Flux extends Flummox {

  constructor() {
    super();
    console.log('hi!!!');
    console.log(PayloadActions);

    this.createActions('payload', PayloadActions);
    this.createStore('payload', TradeStore, this);
  }
}
