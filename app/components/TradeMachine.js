import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import { DragDropContext, DropTarget } from 'react-dnd';

import TopBar from './TopBar';
import TeamArea from './TeamArea';
import Check from './Check';

const playerTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().team !== props.teamName;
  },
  drop(props, monitor, component) {
    if(!monitor.didDrop()) {
      props.flux.getActions('trade').playerRemoved(monitor.getItem());
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
  };
}

@DragDropContext(HTML5Backend)
@DropTarget('player', playerTarget, collect)
export default class TradeMachine extends Component {

  static propTypes = {
    teams: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { connectDropTarget } = this.props;

    let style = {
      fontFamily: 'Gill Sans, Gill Sans MT, Calibri, sans-serif',
      fontSize: '15',
      textShadow: '0 1px 1px rgba(0,0,0,0.4)',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      cursor: 'default',
      position: 'absolute',
      left: '0%',
      right: '0%',
      width: '100%',
      height: '100%'
    };

    return connectDropTarget(
      <div style={style} className='TradeMachine'>
        <TopBar
          teams={this.props.teams}
          selectedTeams={this.props.selectedTeams}
          incomingPlayers={this.props.incomingPlayers}
          outgoingPlayers={this.props.outgoingPlayers}
        />
        {
          this.props.selectedTeams.map((team, index) => {
            return (
              <TeamArea
                team={team}
                index={index}
                key={index}
                numTeams={this.props.selectedTeams.length}
                incomingPlayers={this.props.incomingPlayers[index]}
                outgoingPlayers={this.props.outgoingPlayers[index]}
              />
            );
          })
        }

      </div>
    );
  }
}
