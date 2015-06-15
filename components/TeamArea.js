import React, { PropTypes } from 'react';
import _ from 'lodash';
import FluxComponent from 'flummox/component';

import TeamSelect from './TeamSelect';
import PlayerList from './PlayerList';
import IncomingArea from './IncomingArea';

export default class TeamArea extends React.Component {

  constructor(props) {
    super(props);

    this.rosterMinusOutgoing = this.rosterMinusOutgoing.bind(this);
    this.hasIncoming = this.hasIncoming.bind(this);
    this.numTeams = this.numTeams.bind(this);
  }

  rosterMinusOutgoing() {
    if(this.props.outgoingPlayers.length === 0) {
      return this.props.team.players;
    }

    let roster = _.cloneDeep(this.props.team.players);
    let outgoing = _.cloneDeep(this.props.outgoingPlayers);

    let result = _.filter(roster, (player) => {
      return _.find(outgoing, { 'name': player.name }) === undefined;
    });

    return result;
  }

  hasIncoming() {
    return this.props.incomingPlayers.length !== 0;
  }

  numTeams() {
    return 2;
  }

  render() {
    let roster = this.rosterMinusOutgoing();

    const numTeams = this.numTeams();
    let styles = {
      position: 'absolute',
      top: '10%',
      width: '500px',
      height: '800px',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start'
    };
    styles.left = (this.props.number === 'team1') ? '0%' : '50%';

    let nonShrinkStyle = {
      flexBasis: '20px',
      flexShrink: 0,
      textShadow: '0 0 0 white'
    };

    let nonShrinkRedStyle = {
      flexBasis: '20px',
      flexShrink: 0,
      color: 'red'
    };

    let nonShrinkGreenStyle = {
      flexBasis: '20px',
      flexShrink: 0,
      color: 'green'
    };

    let incomingSalary, outgoingSalary;
    let teamSalary = 'Team Salary: ' + this.props.team.totalSalary;

    if(this.props.incomingPlayers.length) {
      incomingSalary = _.cloneDeep(this.props.incomingPlayers);

      incomingSalary = _.chain(incomingSalary)
        .map((player) => {
          player.salary = player.salary.replace(/\,/g, '');
          player.salary = player.salary.slice(1);

          return parseInt(player.salary);
        })
        .reduce((sum, nextSalary) => {
          return sum + nextSalary;
        })
        .value();

      incomingSalary = '+ $' + incomingSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if(this.props.outgoingPlayers.length) {
      outgoingSalary = _.cloneDeep(this.props.outgoingPlayers);

      outgoingSalary = _.chain(outgoingSalary)
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
      outgoingSalary = '- $' + outgoingSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
      <div style={styles}>
        <IncomingArea
          players={this.props.incomingPlayers}
          teamName={this.props.team.teamName}
          min={400}
          flux={this.context.flux}
        />
        <div style={nonShrinkStyle}>
          <span>{teamSalary} </span>
          { incomingSalary ? <span style={nonShrinkGreenStyle}>{incomingSalary} </span> : <span></span> }
          { outgoingSalary ? <span style={nonShrinkRedStyle}>{outgoingSalary}</span> : <span></span> }
        </div>
        <PlayerList roster={roster} team={this.props.team.teamName} flux={this.context.flux} />
      </div>
    );
  }
}

TeamArea.propTypes = {
  outgoingPlayers: PropTypes.array.isRequired,
  incomingPlayers: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired
};

TeamArea.contextTypes = {
  flux: PropTypes.object
};
