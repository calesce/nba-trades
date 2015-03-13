var React = require('react');
var TeamList = require('./TeamList.js');
var _ = require('lodash');

var TeamArea = React.createClass({
  getInitialState() {
    return {
      selectedTeam: null
    };
  },
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
    this.setState({ selectedTeam: event.target.value });
    
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
  render() {
    var selected = false;
    if(this.state.selectedTeam) {
      selected = true;
    }
    var teams = this.props.teams;
    var incoming = this.props.incomingPlayers;
    var teamNames = Object.keys(teams);
    var incomingSalary = this.incomingSalary();
    var roster = this.rosterMinusOutgoing();
    
    return (
      <div className={this.props.class} >
        <select onChange={this.teamSelected}>
          <option value='' disabled>Choose a team</option>
          { teamNames.map((team, index) => {
              return <option key={team} value={team}>{team}</option>
            })
          }
        </select>
        { selected ? 
          <div>
            <TeamList roster={roster} salary={this.props.team.totalSalary} onPlayerClicked={this.props.onPlayerClicked} />
            <br />
            <br />
            <div>Incoming Players:</div>
            <TeamList roster={incoming} onPlayerClicked={this.props.onPlayerClicked} />
            <div>Incoming Salary: {incomingSalary}</div>
          </div>
          : 
          <div></div>
        }
      </div>
    );
  }
});

module.exports = TeamArea;