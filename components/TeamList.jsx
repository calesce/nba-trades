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
      'flex-direction': 'column',
      'flex-wrap': 'wrap',
      'justify-content': 'flex-start',
      'align-items': 'flex-start',
      'align-content': 'flex-start'
    };

    if(this.props.roster) {
      return (
        <div>
          <div className='playerList' style={flexStyle}>
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
    else {
      return <div></div>;
    }
  }
});

module.exports = TeamList;
