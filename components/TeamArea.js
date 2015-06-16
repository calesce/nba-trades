import React, { PropTypes } from 'react';
import _ from 'lodash';
import FluxComponent from 'flummox/component';

import TeamSelect from './TeamSelect';
import PlayerList from './PlayerList';
import IncomingArea from './IncomingArea';

export default class TeamArea extends React.Component {

  constructor(props) {
    super(props);
  }

  rosterMinusOutgoing = () => {
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

  hasIncoming = () => {
    return this.props.incomingPlayers.length !== 0;
  }

  getSalary = (incoming) => {
    let players = incoming ? _.cloneDeep(this.props.incomingPlayers) : _.cloneDeep(this.props.outgoingPlayers);

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

    return '$' + salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {
    let roster = this.rosterMinusOutgoing();

    const numTeams = 2;
    let styles = {
      position: 'absolute',
      top: '10%',
      width: '500px',
      height: '550px',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start'
    };

    if(this.props.number === 0) {
      styles.left = '0%';
    }
    if(this.props.number === 1) {
      styles.left = '25%';
    }
    if(this.props.number === 2) {
      styles.left = '50%';
    }
    if(this.props.number === 3) {
      styles.left = '75%';
    }

    let nonShrinkStyle = {
      flexBasis: '20px',
      flexShrink: 0,
      textShadow: '0 0 0 white',
      WebkitUserSelect: 'text',
      cursor: 'text'
    };

    let nonShrinkRedStyle = _.cloneDeep(nonShrinkStyle);
    nonShrinkRedStyle.color = 'red';

    let nonShrinkGreenStyle = _.cloneDeep(nonShrinkStyle);
    nonShrinkGreenStyle.color = 'green';

    let incomingSalary, outgoingSalary;
    let teamSalary = 'Team Salary: ' + this.props.team.totalSalary;

    if(this.props.incomingPlayers.length) {
      incomingSalary = '+ ' + this.getSalary(true);
    }
    if(this.props.outgoingPlayers.length) {
      outgoingSalary = '- ' + this.getSalary(false);
    }

    return (
      <div style={styles}>
        <IncomingArea
          players={this.props.incomingPlayers}
          teamName={this.props.team.teamName}
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
  number: PropTypes.number.isRequired
};

TeamArea.contextTypes = {
  flux: PropTypes.object
};
