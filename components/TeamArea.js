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
      top: '1%',
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
      flexShrink: 0
    };

    let nonShrinkRedStyle = {
      flexBasis: '20px',
      flexShrink: 0,
      color: 'red'
    };

    let teamSalary;
    if(this.props.outgoingPlayers.length) {
      let outgoingSalary = _.cloneDeep(this.props.outgoingPlayers);

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
      outgoingSalary = '$' + outgoingSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      teamSalary = (
        <div style={nonShrinkStyle}>Team Salary: {this.props.team.totalSalary}
        &nbsp;- <span style={nonShrinkRedStyle}>{outgoingSalary}</span>
        </div>
      );
    }
    else {
      teamSalary = (
        <div style={nonShrinkStyle}>Team Salary: {this.props.team.totalSalary}</div>
      );
    }

    return (
      <div style={styles}>
        <IncomingArea
          players={this.props.incomingPlayers}
          teamName={this.props.team.teamName}
          min={400}
          onPlayerClicked={this.props.onPlayerClicked}
        />
        {teamSalary}
        <TeamSelect
          teams={this.props.teams}
          teamName={this.props.team.teamName}
          number={this.props.number}
        />
        <PlayerList
          roster={roster}
          team={this.props.team.teamName}
          onPlayerClicked={this.props.onPlayerClicked}
        />
      </div>
    );
  }
}

TeamArea.propTypes = {
  onPlayerClicked: PropTypes.func.isRequired,
  outgoingPlayers: PropTypes.array.isRequired,
  incomingPlayers: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired
};

TeamArea.contextTypes = {
  flux: PropTypes.object
};
