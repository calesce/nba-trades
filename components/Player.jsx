var React = require('react');

var Player = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    
    // TODO
    // this.props.handlePlayerSelected
  },
  render:function() {
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