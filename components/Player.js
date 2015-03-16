var React = require('react');
var img = document.createElement('img');

var Player = React.createClass({
  handleClick(e) {
    this.props.onPlayerClicked(this.props.data);
  },
  getImgUrl() {
    var url = this.props.data.name.toLowerCase().replace(/\ /g, '_');
    url = url.replace(/\.+/g, '');
    url = url.replace(/\\\'/g, '');
    url = url.replace(/\_iii/g, '');
    url = url.replace(/\_jr/g, '');
    url = url.replace('tapher', '');
    url = url.replace('damjam', 'damjan');
    url = url.replace('jakaar', 'jakarr');
    url = url.replace('louis_amundson', 'lou_amundson');
    url = url.replace('matt_dellavedova', 'matthew_dellavedova');
    url = url.replace('mcadoo', 'michael_mcadoo');
    url = url.replace('grant_jarrett', 'grant_jerrett');
    url = url.replace('jeffrey', 'jeff');
    url = url.replace('jose_juan', 'jose');
    url = url.replace('tim_hardaway', 'timothy_hardaway');
    
    return '/images/' + url + '.jpg';
  },
  render() {
    var imgUrl = this.getImgUrl();
    
    return (
      <div ref="player" onClick={this.handleClick}>
        <img src={imgUrl} height='45px' width='32px' />
        {this.props.data.name} - {this.props.data.salary}
      </div>
    );
  }
});
  
module.exports = Player;