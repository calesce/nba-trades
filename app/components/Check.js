import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Check extends Component {

  constructor(props) {
    super(props);

    this.state = {
      validity: 'valid'
    };
  }

  determineValidity = (props) => {
    // Any team can take back up to 125% of their outgoing salaries + $100,000 no matter what
    let teamOneIncoming = _.reduce(props.incoming.team1, (sum, player) => {
      return sum + this.salaryToNumber(player.salary);
    }, 0);

    let teamTwoIncoming = _.reduce(props.incoming.team2, (sum, player) => {
      return sum + this.salaryToNumber(player.salary);
    }, 0);

    if((teamOneIncoming * 1.25) + 100000 < teamTwoIncoming) {
      return false;
    }
    else if((teamTwoIncoming * 1.25) + 100000 < teamOneIncoming) {
      return false;
    }
    return true;
  }

  render() {
    let style = { visibility: 'hidden' };
    let div = <div style={style}>Hidden</div>;

    if(this.state.validity === 'valid') {
      style = {
        position: 'relative',
        color: 'green',
        top: 3
      };
      div = <div style={style}>Valid Trade ✓</div>;
    }
    else if(this.state.validity === 'invalid') {
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

    if(this.state.validity) {
      return <div style={checkStyle}>{div}</div>;
    }
    else {
      return <div></div>;
    }
  }
}

Check.propTypes = {
  incomingPlayers: PropTypes.array,
  selectedTeams: PropTypes.array
};
