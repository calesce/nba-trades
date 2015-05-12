var React = require('react');
var _ = require('lodash');
var PlayerList = require('./PlayerList.jsx');

var IncomingArea = React.createClass({
  propTypes: {
    players: React.PropTypes.array,
    onPlayerClicked: React.PropTypes.func,
    min: React.PropTypes.string
  },
  incomingSalary() {
    let players = _.cloneDeep(this.props.players);

    let salary = _.chain(players)
      .map((player) => {
        player.salary = player.salary.replace(/\,/g, '');
        player.salary = player.salary.slice(1);

        return parseInt(player.salary);
      })
      .reduce((sum, nextSalary) => {
        return sum + nextSalary;
      })
      .value();

    // Pretty up the displayed salary
    return '$' + salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  render() {
    let style = {
      flexBasis: '40px',
      flexShrink: 0
    };

    let incomingSalary = this.incomingSalary();

    return (
      <div style={style}>
        <div>Incoming Players:</div>
        <PlayerList
          roster={this.props.players}
          onPlayerClicked={this.props.onPlayerClicked}
          min={this.props.min}
        />
        <div>Incoming Salary: {incomingSalary}</div>
      </div>
    );
  }
});

module.exports = IncomingArea;
