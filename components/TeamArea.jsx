var React = require('react');
var TeamList = require('./TeamList.jsx');
var _ = require('lodash');
var cx = require('classnames');

var TeamArea = React.createClass({
  incomingSalary() {
    if(this.props.incomingPlayers.length === 0) {
      return '';
    }

    var players = _.cloneDeep(this.props.incomingPlayers);

    var total = _.chain(players)
      .map((player) => {
        player.salary = player.salary.replace(/\,/g, '');
        player.salary = player.salary.slice(1);

        return parseInt(player.salary);
      })
      .reduce((sum, salary) => {
        return sum + salary;
      })
      .value();

    return '$' + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  teamSelected(event) {
    this.props.onTeamSelected(event.target.value, this.props.number);
  },
  rosterMinusOutgoing() {
    if(this.props.outgoingPlayers.length === 0) {
      return this.props.team.players;
    }

    var roster = _.cloneDeep(this.props.team.players);
    var outgoing = _.cloneDeep(this.props.outgoingPlayers);

    var result = _.filter(roster, (player) => {
      return _.find(outgoing, { 'name': player.name }) === undefined;
    });

    return result;
  },
  componentWillMount() {
    if(this.props.number === 'team1') {
      this.props.onTeamSelected('Pelicans', 'team1');
    }
    else {
      this.props.onTeamSelected('Grizzlies', 'team2');
    }
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
  getNumTeams() {
    return 2;
  },
  render() {
    let teamNames = this.getSortedTeams();
    let incomingSalary = this.incomingSalary();
    let roster = this.rosterMinusOutgoing();
    let area = (this.props.number === 'team1') ? 'area1' : 'area2';
    let classes = cx(area, this.props.teamName);

    const numTeams = this.getNumTeams();
    let styles = {
      position: 'absolute',
      top: '1%',
      width: '800px',
      height: '800px'
    };

    styles.left = (this.props.number === 'team1') ? '0%' : '50%';

    incomingSalary = incomingSalary === '' ? '$0' : incomingSalary;

    return (
      <div style={styles}>
        <div>
          <select onChange={this.teamSelected}
                  value={this.props.team.teamName ? this.props.team.teamName : ''} >

            <option value='none' disabled>Choose a team</option>
            {
              teamNames.map((team) => {
                return <option key={team.teamName} value={team.teamName}>{team.location} {team.teamName}</option>;
              })
            }
          </select>
          <br />
          <TeamList
            roster={roster}
            class={classes}
            team={this.props.team.teamName}
            salary={this.props.team.totalSalary}
            onPlayerClicked={this.props.onPlayerClicked}
          />
        </div>
        <br />
        <div>
          <div>Incoming Players:</div>
          <TeamList
            roster={this.props.incomingPlayers}
            onPlayerClicked={this.props.onPlayerClicked}
          />
          <div>Incoming Salary: {incomingSalary}</div>
        </div>
      </div>
    );
  }
});

module.exports = TeamArea;
