import React from 'react';
import AppContainer from './components/AppContainer.jsx';
import FluxComponent from 'flummox/component';
import Flux from './Flux';

const flux = new Flux();

React.render(
  <FluxComponent flux={flux}>
    <AppContainer />
  </FluxComponent>,
  document.getElementById('trades')
);
