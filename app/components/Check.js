import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Check extends Component {

  static propTypes = {
    incomingPlayers: PropTypes.array,
    outgoingPlayers: PropTypes.array,
    selectedTeams: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  salaryToNumber = (salaryString) => {
    return parseInt(salaryString.replace(/\$|\,/g, ''));
  }

  salaryOfTeam = (team) => {
    return _.reduce(team, (sum, player) => {
      return sum + this.salaryToNumber(player.salary);
    }, 0);
  }

  isTrade = () => {
    let check = false;

    this.props.incomingPlayers.forEach((teamIncoming) => {
      if(teamIncoming.length > 0) {
        check = true;
      }
    });

    return check;
  }

  determineValidity = () => {
    let valid = {
      valid: true,
      teams: []
    };

    for(var i = 0; i < this.props.incomingPlayers.length; i++) {
      let incomingSalary = this.salaryOfTeam(this.props.incomingPlayers[i]);
      let outgoingSalary = this.salaryOfTeam(this.props.outgoingPlayers[i]);

      // Any team can take back up to 125% of their outgoing salaries + $100,000 no matter what
      if(incomingSalary > (outgoingSalary * 1.25) + 100000) {
        valid.valid = false;
        valid.teams.push(i);
      }
    }

    return valid;
  }

  render() {
    let isTrade = this.isTrade();

    let style = { visibility: 'hidden' };
    let div = <div style={style}>Hidden</div>;
    if(!isTrade) {
      return div;
    }

    let { valid, teams } = this.determineValidity();
    if(valid) {
      style = {
        position: 'relative',
        color: 'green',
        top: 3
      };
      div = <div style={style}>Valid Trade ✓</div>;
    }
    else {
      style = {
        position: 'relative',
        color: 'red',
        top: 3
      };
      div = <div style={style}>Invalid Trade ✕</div>;
    }

    let checkStyle = {
      position: 'absolute',
      right: '1%',
      top: 22,
      width: 150,
      height: 30,
      paddingRight: 5,
      textShadow: '0 0 0 rgba(0,0,0,0)',
      fontSize: 20,
      backgroundColor: '#e1e1e1',
      borderRadius: 4,
      textAlign: 'center'
    };

    return <div style={checkStyle}>{div}</div>;
  }
}
