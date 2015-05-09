var React = require('react');
var Player = require('./Player.jsx');

var PlayerList = React.createClass({
  render() {
    let style = {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    };

    return (
      <div style={style}>
        {
          this.props.roster.map((player, index) => {
            if(this.props.team) {
              player.team = this.props.team;
            }
            return <Player key={index} data={player} onPlayerClicked={this.props.onPlayerClicked} />;
          })
        }
      </div>
    );
  }
});

module.exports = PlayerList;
