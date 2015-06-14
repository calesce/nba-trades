import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import TeamSelect from './TeamSelect';

export default class TopBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let styles = {
      position: 'absolute',
      background: '#EB6625',
      color: 'white',
      top: '0%',
      left: '0%',
      height: '70px',
      width: '100%'
    };

    return (
      <div style={styles}>
        NBA Trade Machine&nbsp;
        <TeamSelect
          teamName={this.props.selectedTeams.team1.teamName}
          teams={ _.filter(this.props.teams, team => team.teamName !== this.props.selectedTeams.team2.teamName ) }
          number="team1"
        />
        <TeamSelect
          teamName={this.props.selectedTeams.team2.teamName}
          teams={ _.filter(this.props.teams, team => team.teamName !== this.props.selectedTeams.team1.teamName ) }
          number="team2"
        />
      </div>
    );
  }
}
