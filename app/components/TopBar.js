import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import TeamSelect from './TeamSelect';
import Check from './Check';

export default class TopBar extends Component {

  constructor(props) {
    super(props);
  }

  addTeam = () => {
    this.context.flux.getActions('trade').teamAdded();
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
                />
              );
            })
          }
          { teamCount < 4 ? <button onClick={this.addTeam}>Add Team ➕</button> : <div></div> }
        </div>
        <Check
          incomingPlayers={this.props.incomingPlayers}
          selectedTeams={this.props.selectedTeams}
        />
      </div>
    );
  }
}

TopBar.contextTypes = {
  flux: PropTypes.object
};

TopBar.propTypes = {
  incomingPlayers: PropTypes.array,
  selectedTeams: PropTypes.array
};
