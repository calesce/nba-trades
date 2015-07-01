import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';

export default class TeamSelect extends Component {

  constructor(props) {
    super(props);
  }

  teamSelected = (name) => {
    this.context.flux.getActions('trade').teamSelected(name, this.props.number);
  }

  buttonClicked = (event) => {
    this.context.flux.getActions('trade').teamRemoved(this.props.number);
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
      width: '10px',
      flexBasis: 230,
      display: 'flex',
      flexDirection: 'row'
    };

    let options = teams.map((team) => {
      return {
        label: `${team.location} ${team.teamName}`,
        value: team.teamName
      };
    });


    return (
      <div style={style}>
        <Select
          onChange={this.teamSelected}
          value={this.props.teamName ? this.props.teamName : ''}
          options={options}
          clearable={false}
          searchable={false}
        />
        <button onClick={this.buttonClicked}>x</button>
      </div>
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
