var React = require('react');
var TeamSelect = require('./TeamSelect.jsx');
var TeamList = require('./TeamList.jsx');
var _ = require('lodash');

var TeamArea = React.createClass({
  incomingSalary() {
    if(this.props.incomingPlayers.length === 0) {
      return '';
    }

    let players = _.cloneDeep(this.props.incomingPlayers);

    let total = _.chain(players)
      .map((player) => {
        player.salary = player.salary.replace(/\,/g, '');
        player.salary = player.salary.slice(1);

        return parseInt(player.salary);
      })
      .reduce((sum, salary) => {
        return sum + salary;
      })
      .value();

    // Pretty up the displayed salary
    return '$' + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  teamSelected(value, number) {
    this.props.onTeamSelected(value, number);
  },
  rosterMinusOutgoing() {
    if(this.props.outgoingPlayers.length === 0) {
      return this.props.team.players;
    }

    let roster = _.cloneDeep(this.props.team.players);
    let outgoing = _.cloneDeep(this.props.outgoingPlayers);

    let result = _.filter(roster, (player) => {
      return _.find(outgoing, { 'name': player.name }) === undefined;
    });

    return result;
  },
  componentWillMount() {
    if(this.props.number === 'team1') {
      this.props.onTeamSelected('Wizards', 'team1');
    }
    else {
      this.props.onTeamSelected('Grizzlies', 'team2');
    }
  },
  hasIncoming() {
    return this.props.incomingPlayers.length !== 0;
  },
  numTeams() {
    return 2;
  },
  render() {
    let roster = this.rosterMinusOutgoing();
    let incomingSalary = this.hasIncoming() ? this.incomingSalary() : '$0';

    const numTeams = this.numTeams();
    let styles = {
      position: 'absolute',
      top: '1%',
      width: '400px',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start'
    };
    styles.left = (this.props.number === 'team1') ? '0%' : '50%';

    let nonShrinkStyle = {
      flexBasis: '20px',
      flexShrink: 0
    };

    return (
      <div style={styles}>
        <TeamSelect
          teams={this.props.teams}
          team={this.props.team}
          number={this.props.number}
          onTeamSelected={this.teamSelected}
        />
        <TeamList
          roster={roster}
          team={this.props.team.teamName}
          onPlayerClicked={this.props.onPlayerClicked}
        />
        { this.props.team.totalSalary ? <div style={nonShrinkStyle}>Team Salary: { this.props.team.totalSalary }</div> : '' }
        { this.hasIncoming() ? <div style={nonShrinkStyle}>Incoming Players:</div> : '' }
        { this.hasIncoming() ? <TeamList roster={this.props.incomingPlayers} onPlayerClicked={this.props.onPlayerClicked} /> : '' }
        { this.hasIncoming() ? <div style={nonShrinkStyle}>Incoming Salary: {incomingSalary}</div> : '' }
      </div>
    );
  }
});

module.exports = TeamArea;
