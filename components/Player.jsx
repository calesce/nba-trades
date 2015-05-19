import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const teamStyle = require('./teamStyles');

const Types = {
  PLAYER: 'player'
};

const playerSource = {
  beginDrag(props) {
    const item = { id: props.name, team: props.teamName };
    return item;
  },

  endDrag(props, monitor, component) {
    if(!monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    props.onPlayerClicked(props.player);
  }
};

@DragSource(Types.PLAYER, playerSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Player extends Component {

  constructor(props) {
    super(props);
  }

  handleClick = (player) => {
    this.props.onPlayerClicked(player);
  }

  formatTeamName = () => {
    return this.props.teamName.toLowerCase().replace(/\ /, '').replace('76', 'six');
  }

  render() {
    const className = this.formatTeamName();
    const { isDragging, connectDragSource } = this.props;

    let style = {
      flexShrink: 0,
      height: '50px',
      width: '160px',
      margin: '3px',
      display: 'inline-block',
      position: 'relative',
      background: teamStyle[className].background,
      color: teamStyle[className].color,
      border: teamStyle[className].border,
      cursor: '-webkit-grab'
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

    return connectDragSource(
      <div style={style} onClick={this.handleClick.bind(this, this.props.player)}>
        <img style={imgStyle} src={this.props.imageUrl} height='45px' width='32px' />
        <span style={nameStyle} className="playerName">{this.props.name}</span>
        <span style={salaryStyle} className="playerSalary">{this.props.salary}</span>
      </div>
    );
  }
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  handleClick: PropTypes.func
};
