var React = require('react');
var teamStyle = require('./teamStyles');

var Player = React.createClass({
  handleClick(e) {
    this.props.onPlayerClicked(this.props.data);
  },
  render() {
    let className = this.props.data.team.toLowerCase();
    className = className.replace(/\ /, '')
      .replace('76ers', 'sixers');

    let teamColors = teamStyle[className];

    let style = {
      flexShrink: 0,
      height: '50px',
      width: '160px',
      margin: '3px',
      display: 'inline-block',
      position: 'relative',
      background: teamColors.background,
      color: teamColors.color,
      border: teamColors.border
    };

    let imgStyle = {
      position: 'absolute',
      left: '2px',
      top: '3px'
    };

    let nameStyle = {
      position: 'absolute',
      right: '5px'
    };

    let salaryStyle = {
      position: 'absolute',
      right: '5px',
      bottom: '5px'
    };

    return (
      <div style={style} ref="player" onClick={this.handleClick}>
        <img style={imgStyle} src={this.props.data.imageUrl} height='45px' width='32px' />
        <span style={nameStyle} className="playerName">{this.props.data.name}</span>
        <span style={salaryStyle} className="playerSalary">{this.props.data.salary}</span>
      </div>
    );
  }
});

module.exports = Player;
