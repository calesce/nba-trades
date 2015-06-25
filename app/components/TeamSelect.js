import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class TeamSelect extends Component {

  constructor(props) {
    super(props);
  }

  teamSelected = (event) => {
    this.context.flux.getActions('trade').teamSelected(event.target.value, this.props.number);
  }

  getSortedTeams = () => {
    return _.chain(this.props.teams)
      .map((team) => {
        return {
          teamName: team.teamName,
          location: team.location
        };
      })
      .sortBy((team) => {
        return team.location;
      })
      .value();
  }

  render() {
    let teams = this.getSortedTeams();

    let style = {
      flexBasis: '165px',
      flexShrink: 0
    };

    return (
      <select style={style}
        onChange={this.teamSelected}
        value={this.props.teamName ? this.props.teamName : ''} >

        <option value='none'>Choose a team</option>
        {
          teams.map((team) => {
            return <option key={team.teamName} value={team.teamName}>{team.location} {team.teamName}</option>;
          })
        }
      </select>
    );
  }
}

TeamSelect.propTypes = {
  teamName: PropTypes.string,
  teams: PropTypes.array.isRequired
};

TeamSelect.contextTypes = {
  flux: PropTypes.object
};
