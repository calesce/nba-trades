import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import TeamSelect from './TeamSelect';

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
      left: 20,
      width: '80%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    };

    let titleStyle = {
      fontSize: 22
    };

    let teamCount = this.props.selectedTeams.length;

    return (
      <div style={barStyle}>
        <div style={flexStyle}>
          <span style={titleStyle}>NBA Trade Machine</span>
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
          { teamCount < 4 ? <button onClick={this.addTeam}>+</button> : <div></div> }
        </div>
      </div>
    );
  }
}

TopBar.contextTypes = {
  flux: PropTypes.object
};
