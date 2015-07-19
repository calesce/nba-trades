import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import TeamSelect from './TeamSelect';
import Check from './Check';

export default class TopBar extends Component {

  static propTypes = {
    incomingPlayers: PropTypes.array,
    outgoingPlayers: PropTypes.array,
    selectedTeams: PropTypes.array
  };

  addTeam = () => {
    this.props.addTeam();
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
      top: '0%',
      left: 0,
      height: '70px',
      width: '100%'
    };

    let flexStyle = {
      position: 'relative',
      top: 17,
      left: '1%',
      width: '88%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };

    let titleStyle = {
      fontSize: 22,
      flexBasis: '12%'
    };

    let teamCount = this.props.selectedTeams.length;

    return (
      <div style={barStyle}>
        <div style={flexStyle}>
          <span style={titleStyle}>Trade Machine</span>
          {
            this.props.selectedTeams.map((team, index) => {
              return (
                <TeamSelect
                  teamName={team.teamName}
                  teams={this.filteredTeams(index)}
                  number={index}
                  count={teamCount}
                  key={index}
                  teamSelected={this.props.teamSelected}
                  removeTeam={this.props.removeTeam}
                />
              );
            })
          }
          { teamCount < 4 ? <button onClick={this.addTeam}>Add Team ➕</button> : <div></div> }
        </div>
        <Check
          incomingPlayers={this.props.incomingPlayers}
          outgoingPlayers={this.props.outgoingPlayers}
          selectedTeams={this.props.selectedTeams}
          salaryCap={66000000}
          luxuryTax={74000000}
        />
      </div>
    );
  }
}
