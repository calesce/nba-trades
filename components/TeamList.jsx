var React = require('react');
var Player = require('./Player.jsx');
var _ = require('lodash');

var TeamList = React.createClass({
  render() {
    let roster = _.cloneDeep(this.props.roster);

    let flexStyle = {
      padding: '3px',
      height: 500,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    };

    return (
      <div>
        <div style={flexStyle}>
          {
            roster.map((player, index) => {
              if(this.props.team) {
                player.team = this.props.team;
              }
              return <Player key={index} data={player} onPlayerClicked={this.props.onPlayerClicked} />;
            })
          }
        </div>
        <div>
          { this.props.salary ? <div>Team Salary: { this.props.salary }</div> : <div></div> }
        </div>
      </div>
    );
  }
});

module.exports = TeamList;
