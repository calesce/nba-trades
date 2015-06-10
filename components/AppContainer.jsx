import React, { Component } from 'react';
import TradeMachine from './TradeMachine.jsx';
import FluxComponent from 'flummox/component';
import Flux from '../Flux';

export default class AppContainer extends Component {
  constructor() {
    super();

    this.state = {
      teams: ''
    };
  }

  componentDidMount() {
    /*let http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:8080/api', true);
    http.send();

    http.onload = () => {
      let teams = JSON.parse(http.responseText);
      this.setState({ teams });
    };*/
  }

  render() {
    let salaryCap = 63065000;
    let taxLine = 76829000;
    console.log(this.props);

    /*if(this.state.teams) {
      return <TradeMachine
        teams={this.state.teams}
        salaryCap={salaryCap}
        taxLine={taxLine}
      />;
    }
    else {
      return <div></div>;
    }*/
    return (
      <FluxComponent connectToStores={['payload']}>
        <TradeMachine
          salaryCap={salaryCap}
          taxLine={taxLine}
        />;
      </FluxComponent>
    );
  }
}
