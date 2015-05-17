import React, { PropTypes } from 'react';
import _ from 'lodash';

import TeamSelect from './TeamSelect.jsx';
import PlayerList from './PlayerList.jsx';
import IncomingArea from './IncomingArea.jsx';

export default class TeamArea extends React.Component {

  constructor(props) {
    super(props);

    this.teamSelected = this.teamSelected.bind(this);
    this.rosterMinusOutgoing = this.rosterMinusOutgoing.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.hasIncoming = this.hasIncoming.bind(this);
    this.numTeams = this.numTeams.bind(this);
  }

  teamSelected(value, number) {
    this.props.onTeamSelected(value, number);
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

  componentWillMount() {
    if(this.props.number === 'team1') {
      this.props.onTeamSelected('Wizards', 'team1');
    }
    else {
      this.props.onTeamSelected('Grizzlies', 'team2');
    }
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

    return (
      <div style={styles}>
        <TeamSelect
          teams={this.props.teams}
          teamName={this.props.team.teamName}
          number={this.props.number}
          onTeamSelected={this.teamSelected}
        />
        <PlayerList
          roster={roster}
          team={this.props.team.teamName}
          onPlayerClicked={this.props.onPlayerClicked}
        />
        { this.props.team.totalSalary ? <div style={nonShrinkStyle}>Team Salary: { this.props.team.totalSalary }</div> : '' }
        <IncomingArea
          players={this.props.incomingPlayers}
          min={400}
          onPlayerClicked={this.props.onPlayerClicked}
        />
      </div>
    );
  }
}

TeamArea.propTypes = {
  onTeamSelected: PropTypes.func.isRequired,
  onPlayerClicked: PropTypes.func.isRequired,
  outgoingPlayers: PropTypes.array.isRequired,
  incomingPlayers: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired
};
