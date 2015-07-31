import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { DropTarget } from 'react-dnd';

import PlayerList from './PlayerList';

const playerTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().team !== props.teamName;
  },
  drop(props, monitor, component) {
    props.addPlayer(monitor.getItem(), props.teamName);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

@DropTarget('player', playerTarget, collect)
export default class IncomingArea extends Component {

  static propTypes = {
    players: PropTypes.array.isRequired
  };

  getDropSize = () => {
    let len = Math.ceil(this.props.players.length / 6) * 150;
    switch(this.props.numTeams) {
      case 3:
        len = Math.ceil(this.props.players.length / 4) * 150;
        break;
      case 4:
        len = Math.ceil(this.props.players.length / 4) * 150;
        break;
    }
    let pixels = len + 'px';
    let size = this.props.players.length ? pixels : '150px';
    return size;
  }

  getHeight = () => {
    const len = Math.ceil(this.props.players.length / 6) * 150;
    return 150;
  }

  render() {
    const flexBasis = this.getDropSize();

    const { connectDropTarget, isOver, canDrop } = this.props;
    let style = {
      background: 'grey',
      flexBasis,
      height: flexBasis,
      width: '98%',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start'
    };

    if(canDrop && isOver) {
      style.background = 'green';
    }
    if(!canDrop && isOver) {
      style.background = 'red';
    }

    if(this.props.players.length) {
      return connectDropTarget(
        <div style={style}>
          <PlayerList
            roster={this.props.players}
          />
        </div>
      );
    }
    else {
      return connectDropTarget(<div style={style}></div>);
    }
  }
}
