import React from 'react';
import AppContainer from './components/AppContainer';
import FluxComponent from 'flummox/component';
import Flux from './Flux';

async function initialize() {
  const flux = new Flux();

  const tradeActions = flux.getActions('trade');
  let data = await tradeActions.getData();

  return React.render(
    <FluxComponent flux={flux}>
      <AppContainer />
    </FluxComponent>,
    document.getElementById('trades')
  );
}

initialize();
