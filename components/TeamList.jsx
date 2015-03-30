var React = require('react');
var Player = require('./Player.jsx');
var _ = require('lodash');

var TeamList = React.createClass({
  render() {
    let roster = _.cloneDeep(this.props.roster);
    
    if(this.props.roster) {
      return (
        <div >
          { 
            roster.map((player, index) => {
              if(this.props.team) {
                player.team = this.props.team;
              }
              return <Player key={index} data={player} onPlayerClicked={this.props.onPlayerClicked} />;
            })
          }
          <br />
          <br />
          { this.props.salary ? <div>Team Salary: { this.props.salary }</div> : <div></div> }
        </div>
      );
    }
    else {
      return <div></div>
    }
  }
});

module.exports = TeamList;