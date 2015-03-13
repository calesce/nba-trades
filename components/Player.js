var React = require('react');

var Player = React.createClass({
  handleClick(e) {
    this.props.onPlayerClicked(this.props.data);
  },
  render() {
    return (
      <div ref="player" onClick={this.handleClick}>
        {this.props.data.name} - {this.props.data.salary}
      </div>
    );
  }
});
  
module.exports = Player;

// TODO later 
//  <img src={this.props.data.imageUrl} height='37px' width='46px' />