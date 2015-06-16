import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import { DragDropContext } from 'react-dnd';

import TopBar from './TopBar';
import TeamArea from './TeamArea';
import Check from './Check';

@DragDropContext(HTML5Backend)
export default class TradeMachine extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let style = {
      fontFamily: 'Gill Sans, Gill Sans MT, Calibri, sans-serif',
      fontSize: '15',
      textShadow: '0 1px 1px rgba(0,0,0,0.4)',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      cursor: 'default'
    };

    return (
      <div style={style} className='TradeMachine'>
        <TopBar
          teams={this.props.teams}
          selectedTeams={this.props.selectedTeams}
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

TradeMachine.propTypes = {
  teams: PropTypes.object
};
