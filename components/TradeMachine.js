import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import { DragDropContext } from 'react-dnd';

import TeamArea from './TeamArea';
import Check from './Check';

@DragDropContext(HTML5Backend)
export default class TradeMachine extends Component {

  constructor(props) {
    super(props);
  }

  getFilteredTeams = (index) => {
    if(this.props.selectedTeams.team1) {
      let teams = _.cloneDeep(this.props.teams);
      let filteredIndex = (index === 'team1') ? 'team2' : 'team1';
      return _.omit(teams, this.props.selectedTeams[filteredIndex].teamName);
    }
    else {
      return this.props.teams;
    }
  }

  render() {
    let style = {
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      cursor: 'default'
    };

    return (
      <div style={style} className='TradeMachine'>
        <TeamArea
          teams={this.getFilteredTeams('team1')}
          team={this.props.selectedTeams.team1}
          number={'team1'}
          incomingPlayers={this.props.incomingPlayers.team1}
          outgoingPlayers={this.props.incomingPlayers.team2}
        />
        <TeamArea
          teams={this.getFilteredTeams('team2')}
          team={this.props.selectedTeams.team2}
          number={'team2'}
          incomingPlayers={this.props.incomingPlayers.team2}
          outgoingPlayers={this.props.incomingPlayers.team1}
        />
      </div>
    );
  }
}

TradeMachine.propTypes = {
  teams: PropTypes.object
};
