var React = require('react');

var Player = React.createClass({
  render() {
    return (
      <div ref="player" onClick={this.props.onPlayerClicked}>
        {this.props.name} - {this.props.salary}
      </div>
    );
  }
});
  
module.exports = Player;

// TODO later 
//  <img src={this.props.data.imageUrl} height='37px' width='46px' />