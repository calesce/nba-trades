import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import TeamSelect from './TeamSelect';

export default class TopBar extends Component {

  constructor(props) {
    super(props);
  }

  filteredTeams = (index) => {
    let notMyTeam = this.props.selectedTeams.filter((team, i) => index !== i);

    return _.filter(this.props.teams, (team, i) => {
      return _.findIndex(notMyTeam, 'teamName', team.teamName) === -1;
    });
  }

  render() {
    let barStyle = {
      position: 'absolute',
      background: '#EB6625',
      color: 'white',
      top: 0,
      left: 0,
      height: '70px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };

    let flexStyle = {
      position: 'relative',
      left: 50,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };

    return (
      <div style={barStyle}>
        <div style={flexStyle}>
          NBA Trade Machine&nbsp;
          {
            this.props.selectedTeams.map((team, index) => {
              return (
                <TeamSelect
                  teamName={team.teamName}
                  teams={this.filteredTeams(index)}
                  number={index}
                  key={index}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
