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

  getDropSize = () => {
    const len = Math.ceil(this.props.players.length / 4) * 150;

    return this.props.players.length ? (len + 'px') : '150px';
  }

  render() {
    const flexBasis = this.getDropSize();
    let style = {
      background: 'grey',
      flexBasis,
      width: '700px',
      flexShrink: 0
    };

    if(this.props.players.length) {
      const incomingSalary = this.incomingSalary();

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
    else {
      return <div style={style}></div>;
    }

  }
}

IncomingArea.propTypes = {
  players: PropTypes.array.isRequired,
  onPlayerClicked: PropTypes.func.isRequired,
  min: PropTypes.number
};
