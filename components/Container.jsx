var React = require('react');
var TradeMachine = require('./TradeMachine.jsx');

var AppContainer = React.createClass({
  getInitialState: function() {
    return { 
      teams: ''
    };
  },
  componentDidMount: function() {
    var http = new XMLHttpRequest();
    http.open('GET', 'http://nbasalaries.herokuapp.com/', true);
    http.send();
    
    http.onload = function() {
      var teamsJson = JSON.parse(http.responseText);
      for(var team in teamsJson) {
        teamsJson[team].players.forEach(function(player) {
          var names = player.name.replace(' ', '_');
          names = names.replace(/\.+/g, '');
          names = names.replace(/\&apos\;/g, '');
          player.name = player.name.replace(/\&apos\;/g, "'");
          player.name = player.name.replace(/\&\#xEA\;/g, "e");
          player.imageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/2.0/sect/statscube/players/large/' + names + '.png';
        });
      }
      
      this.setState({ teams: teamsJson });
    }.bind(this);
  },
  render: function() {
    return <TradeMachine teams={this.state.teams} />;
  }
})

module.exports = AppContainer;