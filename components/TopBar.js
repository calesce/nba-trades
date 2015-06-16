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
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };

    return (
      <div style={styles}>
        NBA Trade Machine&nbsp;
        {
          this.props.selectedTeams.map((team, index) => {
            return (
              <TeamSelect
                teamName={team.teamName}
                teams={this.props.teams}
                number={index}
                key={index}
              />
            );
          })
        }
      </div>
    );
  }
}
