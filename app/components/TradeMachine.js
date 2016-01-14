import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DropTarget } from 'react-dnd';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TradeActions from '../actions/TradeActions';

import TopBar from './TopBar';
import TeamArea from './TeamArea';

const playerTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().team !== props.teamName;
  },
  drop(props, monitor) {
    if(!monitor.didDrop()) {
      props.actions.removePlayer(monitor.getItem());
    }
  }
};

function collect(connect1, monitor) {
  return {
    connectDropTarget: connect1.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
  };
}

class TradeMachine extends Component {
  render() {
    return this.renderApp();
  }

  renderApp = () => {
    let { teams, incomingPlayers, outgoingPlayers, selectedTeams, actions } = this.props;
    const { connectDropTarget } = this.props;

    let style = {
      fontFamily: 'Gill Sans, Gill Sans MT, Calibri, sans-serif',
      fontSize: '15',
      textShadow: '0 1px 1px rgba(0,0,0,0.4)',
      WebkitUserSelect: 'none', MozUserSelect: 'none', MsUserSelect: 'none',
      cursor: 'default',
      position: 'absolute',
      left: '0%', right: '0%',
      width: '100%', height: '100%'
    };

    return connectDropTarget(
      <div style={style} className='TradeMachine'>
        <TopBar
          teams={teams}
          selectedTeams={selectedTeams}
          incomingPlayers={incomingPlayers}
          outgoingPlayers={outgoingPlayers}
          teamSelected={actions.selectTeam}
          addTeam={actions.addTeam}
          removeTeam={actions.removeTeam}
        />
        {
          selectedTeams.map((team, index) => {
            return (
              <TeamArea
                team={team}
                index={index}
                key={index}
                numTeams={selectedTeams.length}
                incomingPlayers={incomingPlayers[index]}
                outgoingPlayers={outgoingPlayers[index]}
                addPlayer={actions.addPlayer}
              />
            );
          })
        }
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    incomingPlayers: state.trades.incomingPlayers,
    outgoingPlayers: state.trades.outgoingPlayers,
    selectedTeams: state.trades.selectedTeams,
    teams: state.trades.teams
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TradeActions, dispatch)
  };
};

const tradeMachine = connect(mapStateToProps, mapDispatchToProps)(DropTarget('player', playerTarget, collect)(TradeMachine));

export default DragDropContext(HTML5Backend)(tradeMachine);
