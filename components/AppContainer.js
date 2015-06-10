import React, { Component } from 'react';
import TradeMachine from './TradeMachine';
import FluxComponent from 'flummox/component';
import Flux from '../Flux';

export default class AppContainer extends Component {
  constructor() {
    super();
  }

  render() {
    let salaryCap = 63065000;
    let taxLine = 76829000;

    return (
      <FluxComponent connectToStores={'payload'}>
        <TradeMachine
          salaryCap = {salaryCap}
          taxLine = {taxLine}
        />
      </FluxComponent>
    );
  }
}
