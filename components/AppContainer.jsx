import React, { Component } from 'react';
import TradeMachine from './TradeMachine.jsx';

export default class AppContainer extends Component {
  constructor() {
    super();

    this.state = {
      teams: ''
    };
  }

  componentDidMount() {
    let http = new XMLHttpRequest();
    http.open('GET', 'http://nbasalaries.herokuapp.com', true);
    http.send();

    http.onload = () => {
      let teams = JSON.parse(http.responseText);
      this.setState({ teams });
    };
  }

  render() {
    let salaryCap = 63065000;
    let taxLine = 76829000;

    if(this.state.teams) {
      return <TradeMachine
        teams={this.state.teams}
        salaryCap={salaryCap}
        taxLine={taxLine}
      />;
    }
    else {
      return <div></div>;
    }
  }
}
