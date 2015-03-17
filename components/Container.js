var React = require('react');
var TradeMachine = require('./TradeMachine.js');

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
      for(let team in teamsJson) {
        teamsJson[team].players.forEach((player) => {
          let names = player.name.replace(' ', '_');
          names = names.replace(/\.+/g, '');
        });
      }
      
      this.setState({ teams: teamsJson });
    };
  },
  render() {
    if(this.state.teams) {
      return <TradeMachine teams={this.state.teams} />;
    }
    else {
      return <div></div>;
    }
  }
})

module.exports = AppContainer;