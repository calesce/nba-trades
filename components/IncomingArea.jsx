import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import PlayerList from './PlayerList.jsx';

export default class IncomingArea extends Component {

  constructor(props) {
    super(props);
  }

  incomingSalary = () => {
    let players = _.cloneDeep(this.props.players);

    let salary = _.chain(players)
      .map((player) => {
        player.salary = player.salary.replace(/\,/g, '');
        player.salary = player.salary.slice(1);

        return parseInt(player.salary);
      })
      .reduce((sum, nextSalary) => {
        return sum + nextSalary;
      })
      .value();

    // Pretty up the displayed salary
    return '$' + salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {
    let style = {
      flexBasis: '40px',
      flexShrink: 0
    };

    let incomingSalary = this.incomingSalary();

    return (
      <div style={style}>
        <div>Incoming Players:</div>
        <PlayerList
          roster={this.props.players}
          onPlayerClicked={this.props.onPlayerClicked}
          min={this.props.min}
        />
        <div>Incoming Salary: {incomingSalary}</div>
      </div>
    );
  }
}

IncomingArea.propTypes = {
  players: PropTypes.array.isRequired,
  onPlayerClicked: PropTypes.func.isRequired,
  min: PropTypes.number
};
