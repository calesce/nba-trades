var React = require('react');
var TeamList = require('./TeamList.jsx');
var _ = require('lodash');

var TeamSelect = React.createClass({
  teamSelected(event) {
    this.props.onTeamSelected(event.target.value, this.props.number);
  },
  getSortedTeams() {
    return _.chain(this.props.teams)
      .sortBy( (team) => {
        return team.location;
      })
      .map( (team) => {
        return {
          teamName: team.teamName,
          location: team.location
        };
      })
      .value();
  },
  render() {
    let teamNames = this.getSortedTeams();

    let style = {
      width: '200px',
      flexBasis: '30px',
      flexShrink: 0,
      order: -1
    };

    return (
      <select style={style}
        onChange={this.teamSelected}
        value={this.props.team.teamName ? this.props.team.teamName : ''} >

        <option value='none' disabled>Choose a team</option>
        {
          teamNames.map((team) => {
            return <option key={team.teamName} value={team.teamName}>{team.location} {team.teamName}</option>;
          })
        }
      </select>
    );
  }
});

module.exports = TeamSelect;