import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';

export default class TeamSelect extends Component {

  static propTypes = {
    teamName: PropTypes.string,
    teams: PropTypes.array.isRequired
  };

  teamSelected = (name) => {
    this.props.teamSelected(name, this.props.number);
  }

  buttonClicked = () => {
    this.props.removeTeam(this.props.number);
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
      flexBasis: '22%',
      display: 'flex',
      flexDirection: 'row'
    };

    let options = teams.map((team) => {
      return {
        label: `${team.location} ${team.teamName}`,
        value: team.teamName
      };
    });

    let count = this.props.count;

    return (
      <div style={style}>
        <Select
          onChange={this.teamSelected}
          value={this.props.teamName ? this.props.teamName : ''}
          options={options}
          clearable={false}
          searchable={false}
        />
        { count > 2 ? <button onClick={this.buttonClicked}>x</button> : <div></div> }
      </div>
    );
  }
}
