var React = require('react');
var cx = require('classnames');

var Player = React.createClass({
  handleClick(e) {
    this.props.onPlayerClicked(this.props.data);
  },
  render() {
    let className = this.props.data.team.toLowerCase();
    className = className.replace(/\ /, '');
    className = className.replace('76ers', 'sixers');

    className = cx('player', className);

    return (
      <div className={className} ref="player" onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} height='45px' width='32px' />
        <span className="playerName">{this.props.data.name}</span>
        <span className="playerSalary">{this.props.data.salary}</span>
      </div>
    );
  }
});

module.exports = Player;
