import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Check extends Component {

  static propTypes = {
    incomingPlayers: PropTypes.array,
    outgoingPlayers: PropTypes.array,
    selectedTeams: PropTypes.array,
    salaryCap: PropTypes.number,
    luxuryTax: PropTypes.number
  };

  isUnderCap = (salary) => {
    return salary < this.props.salaryCap;
  }

  isUnderTax = (team) => {
    return this.salaryOfTeam(team) < this.props.luxuryTax;
  }

  salaryToNumber = (salaryString) => {
    return parseInt(salaryString.replace(/\$|\,/g, ''));
  }

  salaryOfTeam = (team) => {
    return _.reduce(team, (sum, player) => {
      return sum + this.salaryToNumber(player.salary);
    }, 0);
  }

  potentialSalary = (currentSalary, incomingSalary) => {
    return currentSalary + incomingSalary;
  }

  isTrade = () => {
    // TODO this can be shorter, refactor
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
      teams: []
    };

    this.props.incomingPlayers.forEach((team, i) => {
      let incomingSalary = this.salaryOfTeam(team);
      let outgoingSalary = this.salaryOfTeam(team);

      let potentialSalary = this.salaryToNumber(this.props.selectedTeams[i].totalSalary) + incomingSalary;
      // 1. Any team under the cap can take any amount in up to the cap level + $100,000
      // 2. Teams under tax but over cap. I think it's 150% but we'll see. Most cases
      // 3. Any team can take back up to 125% of their outgoing salaries + $100,000 no matter what
      if(potentialSalary < (this.props.salaryCap + 100000)) {
        valid.valid = true;
      }
      else if(incomingSalary > (outgoingSalary * 1.25) + 100000) {
        valid.valid = false;
        valid.teams.push(i);
      }
    });

    return valid;
  }

  render() {
    let isTrade = this.isTrade();

    let div = <div style={{visibility: 'hidden'}}>Hidden</div>;
    if(!isTrade) {
      return div;
    }

    let { valid, teams } = this.determineValidity();
    if(valid) {
      let greenStyle = {
        position: 'relative',
        color: 'green',
        top: 3
      };
      div = <div style={greenStyle}>Valid Trade ✓</div>;
    }
    else {
      let redStyle = {
        position: 'relative',
        color: 'red',
        top: 3
      };
      div = <div style={redStyle}>Invalid Trade ✕</div>;
    }

    let style = {
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

    return <div style={style}>{div}</div>;
  }
}
