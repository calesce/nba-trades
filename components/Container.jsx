var React = require('react');
var TradeMachine = require('./TradeMachine.jsx');

var AppContainer = React.createClass({
  getInitialState() {
    return { 
      teams: ''
    };
  },
  componentDidMount() {
    let http = new XMLHttpRequest();
    http.open('GET', 'http://nbasalaries.herokuapp.com/', true);
    http.send();
    
    http.onload = () => {
      var teamsJson = JSON.parse(http.responseText);
      this.setState({ teams: teamsJson });
    };
  },
  render() {
    let salaryCap = 63065000;
    let taxLine = 76829000;
    
    if(this.state.teams) {
      return <TradeMachine
        teams={this.state.teams}
        salaryCap={salaryCap}
        taxLine={taxLine}
      />;
    }
    else {
      return <div></div>;
    }
  }
})

module.exports = AppContainer;