var React = require('react');
var cx = require('classnames');

var Player = React.createClass({
  handleClick(e) {
    this.props.onPlayerClicked(this.props.data);
  },
  render() {
    var className = this.props.data.team.toLowerCase();
    className = className.replace(/\ /, '');
    className = className.replace('76ers', 'sixers');
    
    return (
      <div className={className} ref="player" onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} height='45px' width='32px' />
        {this.props.data.name} - {this.props.data.salary}
      </div>
    );
  }
});
  
module.exports = Player;