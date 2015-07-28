import React, { Component } from 'react';
import { Provider } from 'react-redux';

import TradeMachine from '../components/TradeMachine';

import { createStore, combineReducers } from 'redux';
import * as reducers from '../reducers';
import * as types from '../constants/ActionTypes';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

export default class App extends Component {
  componentDidMount() {
    store.dispatch({
      type: types.FETCH_NBA_DATA,
      teams: this.props.teams
    });
  }

  render() {
    return (
      <Provider store={store}>
        {() => <TradeMachine /> }
      </Provider>
    );
  }
}
