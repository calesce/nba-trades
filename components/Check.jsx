var React = require('react');
var _ = require('lodash');

var Check = React.createClass({
  propTypes: {
    incoming: React.PropTypes.array
  },
  getInitialState() {
    return {
      valid: 'none'
    };
  },
  componentWillReceiveProps(nextProps) {
    if(!this.isTrade(nextProps.incoming)) {
      this.setState({
        valid: 'hidden'
      });
    }
    else {
      this.setState({
        valid: 'valid'
      });

      if(!this.determineValidity(nextProps)) {
        this.setState({
          valid: 'invalid'
        });
      }
    }
  },
  isTrade(incoming) {
    let check = 0;

    _.forEach(incoming, (incomingPlayer) => {
      if(incomingPlayer.length > 0) {
        ++check;
      }
    });

    return check > 1;
  },
  determineValidity(props) {
    // Any team can take back up to 125% of their outgoing salaries + $100,000 no matter what
    let teamOneIncoming = _.reduce(props.incoming.team1, (sum, player) => {
      return sum + this.salaryToNumber(player.salary);
    }, 0);

    let teamTwoIncoming = _.reduce(props.incoming.team2, (sum, player) => {
      return sum + this.salaryToNumber(player.salary);
    }, 0);

    if((teamOneIncoming * 1.25) + 100000 < teamTwoIncoming) {
      return false;
    }
    else if((teamTwoIncoming * 1.25) + 100000 < teamOneIncoming) {
      return false;
    }
    return true;
  },
  salaryToNumber(salaryString) {
    return parseInt(salaryString.replace(/\$|\,/g, ''));
  },
  render() {
    let style = { visibility: 'hidden' };
    let div = <div style={style}>Hidden</div>;

    if(this.state.valid === 'valid') {
      style = {
        color: 'green'
      };
      div = <div style={style}>Trade is valid</div>;
    }
    else if(this.state.valid === 'invalid') {
      style = {
        color: 'red'
      };
      div = <div style={style}>Trade is invalid</div>;
    }

    let checkStyle = {
      position: 'absolute',
      top: '1%',
      left: '80%'
    };

    return (
      <div style={checkStyle}>{div}</div>
    );
  }
});

module.exports = Check;
