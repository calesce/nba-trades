var React = require('react');
var _ = require('lodash');

var TeamSelect = require('./TeamSelect.jsx');
var PlayerList = require('./PlayerList.jsx');
var IncomingArea = require('./IncomingArea.jsx');

var TeamArea = React.createClass({
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
          teamName={this.props.team.teamName}
          number={this.props.number}
          onTeamSelected={this.teamSelected}
        />
        <PlayerList
          roster={roster}
          team={this.props.team.teamName}
          onPlayerClicked={this.props.onPlayerClicked}
        />
        { this.props.team.totalSalary ? <div style={nonShrinkStyle}>Team Salary: { this.props.team.totalSalary }</div> : '' }
        {
          this.hasIncoming() ?
            <IncomingArea
              players={this.props.incomingPlayers}
              min={400}
              onPlayerClicked={this.props.onPlayerClicked}
              /> : ''
        }
      </div>
    );
  }
});

module.exports = TeamArea;
