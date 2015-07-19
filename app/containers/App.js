import React, { Component } from 'react';
import { Provider } from 'react-redux';

import TradeMachine from '../components/TradeMachine';

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        {() => <TradeMachine /> }
      </Provider>
    );
  }
}
