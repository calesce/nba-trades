import React from 'react';
import AppContainer from './components/AppContainer';
import FluxComponent from 'flummox/component';
import Flux from './Flux';

const flux = new Flux();

async function initialize() {
  const payloadAction = flux.getActions('payload');
  let data = await payloadAction.getData();

  return React.render(
    <FluxComponent flux={flux}>
      <AppContainer />
    </FluxComponent>,
    document.getElementById('trades')
  );
}

initialize();
