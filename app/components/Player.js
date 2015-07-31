import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const teamStyle = require('./teamStyles');

const Types = {
  PLAYER: 'player'
};

const playerSource = {
  beginDrag(props) {
    const item = { id: props.name, team: props.teamName, salary: props.salary, imageUrl: props.imageUrl, name: props.name };
    return item;
  },

  endDrag(props, monitor, component) {
    if(!monitor.didDrop()) {
      return;
    }
  }
};

@DragSource(Types.PLAYER, playerSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Player {

  static propTypes = {
    name: PropTypes.string.isRequired,
    salary: PropTypes.string.isRequired,
    teamName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired
  };

  formatTeamName = () => {
    return this.props.teamName.toLowerCase().replace(/\ /, '').replace('76', 'six');
  }

  render() {
    const className = this.formatTeamName();
    const { isDragging, connectDragSource } = this.props;

    let style = {
      flexShrink: 0,
      height: '58px',
      width: '163px',
      margin: '3px',
      fontSize: '13',
      display: 'inline-block',
      position: 'relative',
      background: teamStyle[className].background,
      color: teamStyle[className].color,
      border: teamStyle[className].border,
      cursor: '-webkit-grab',
      boxShadow: '0 1px 1px rgba(0,0,0,0.4)',
    };

    let imgStyle = {
      position: 'absolute',
      left: '2px',
      top: '3px'
    };

    let nameStyle = {
      position: 'absolute',
      wordWrap: 'break-word',
      left: '50px',
      width: '84px',
      height: '34px'
    };

    let salaryStyle = {
      position: 'absolute',
      left: '50px',
      bottom: '5px',
      width: '100px'
    };

    if(isDragging) {
      style.opacity = 0;
    }
    let name = this.props.name.replace('\\', '').replace('Antetokounmpo', 'Anteto.');

    return connectDragSource(
      <div style={style}>
        <img style={imgStyle} src={this.props.imageUrl} height='45px' width='32px' />
        <span style={nameStyle} className="playerName">{name}</span>
        <span style={salaryStyle} className="playerSalary">{this.props.salary}</span>
      </div>
    );
  }
}
