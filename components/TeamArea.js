var React = require('react');
var TeamList = require('./TeamList.js');
var _ = require('lodash');
var cx = require('classnames');

var TeamArea = React.createClass({
  incomingSalary() {
    if(this.props.incomingPlayers.length === 0) { return ''; }
    
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
    
    return '$' + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  },
  teamSelected(event) {
    this.props.onTeamSelected(event.target.value, this.props.number);
  },
  rosterMinusOutgoing() {
    if(this.props.outgoingPlayers.length === 0) { return this.props.team.players; }
    
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
  render() {
    let teamNames = Object.keys(this.props.teams);
    let incomingSalary = this.incomingSalary();
    let roster = this.rosterMinusOutgoing();
    let area = (this.props.number === 'team1') ? 'area1' : 'area2';
    let classes = cx(area, 'roster');
    
    return (
      <div>
        <div className={this.props.number === 'team1' ? 'area1' : 'area2'}>
          <select 
            onChange={this.teamSelected}
            value={this.props.team.teamName ? this.props.team.teamName: ''}
          >
            <option value='none' disabled>Choose a team</option>
            { teamNames.map((team, index) => {
                return <option key={team} value={team}>{team}</option>
              })
            }
          </select>
          <br />
          <br />
          <TeamList 
            roster={roster}
            class={classes}
            salary={this.props.team.totalSalary}
            onPlayerClicked={this.props.onPlayerClicked}
          />
        </div>
        <div className={this.props.number === 'team1' ? 'area3' : 'area4'}>
          <div>Incoming Players:</div>
          <TeamList roster={this.props.incomingPlayers} onPlayerClicked={this.props.onPlayerClicked} />
          <div>Incoming Salary: {incomingSalary}</div>
        </div>
      </div>
    );
  }
});

module.exports = TeamArea;