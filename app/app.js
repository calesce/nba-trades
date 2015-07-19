import React from 'react';
import App from './containers/App';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from './reducers';

import * as TradeActions from './actions/TradeActions';
import * as types from './constants/ActionTypes';

(function initialize() {

  fetch('http://localhost:8080/api')
    .then((response) => {
      return response.json();
    })
    .then((teams) => {
      const reducer = combineReducers(reducers);
      const store = createStore(reducer);

      // let teams = json;
      store.dispatch({
        type: types.FETCH_NBA_DATA,
        teams
      });

      return React.render(
        <App store={store} />,
        document.getElementById('trades')
      );
    })
    .catch((err) => {
      console.log(err);
    });
})();
