var React = require('react');

var Player = React.createClass({
  handleClick(e) {
    this.props.onPlayerClicked(this.props.data);
  },
  render() {
    return (
      <div ref="player" onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} height='45px' width='32px' />
        {this.props.data.name} - {this.props.data.salary}
      </div>
    );
  }
});
  
module.exports = Player;