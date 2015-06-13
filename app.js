import React from 'react';
import TradeMachine from './components/TradeMachine';
import FluxComponent from 'flummox/component';
import Flux from './Flux';

async function initialize() {
  const flux = new Flux();

  const tradeActions = flux.getActions('trade');
  let data = await tradeActions.getData();

  return React.render(
    <FluxComponent flux={flux} connectToStores={'trade'}>
      <TradeMachine />
    </FluxComponent>,
    document.getElementById('trades')
  );
}

initialize();
