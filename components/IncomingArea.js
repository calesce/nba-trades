import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { DropTarget } from 'react-dnd';

import PlayerList from './PlayerList';

const playerTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().team !== props.teamName;
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

  constructor(props) {
    super(props);
  }

  getDropSize = () => {
    const len = Math.ceil(this.props.players.length / 8) * 150;

    return this.props.players.length ? (len + 'px') : '150px';
  }

  render() {
    const flexBasis = this.getDropSize();

    const { connectDropTarget, isOver, canDrop } = this.props;
    let style = {
      background: 'grey',
      flexBasis,
      height: flexBasis,
      width: '700px',
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
            flux={this.props.flux}
          />
        </div>
      );
    }
    else {
      return connectDropTarget(<div style={style}></div>);
    }

  }
}

IncomingArea.propTypes = {
  players: PropTypes.array.isRequired
};
