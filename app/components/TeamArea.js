import React, { PropTypes } from 'react';
import _ from 'lodash';
import { DropTarget } from 'react-dnd';

import TeamSelect from './TeamSelect';
import PlayerList from './PlayerList';
import IncomingArea from './IncomingArea';

const playerTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().team !== props.team.teamName;
  },
  drop(props, monitor, component) {
    props.addPlayer(monitor.getItem(), props.team.teamName);
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
export default class TeamArea extends React.Component {

  static propTypes = {
    outgoingPlayers: PropTypes.array,
    incomingPlayers: PropTypes.array,
    team: PropTypes.object,
    index: PropTypes.number
  };

  rosterMinusOutgoing = () => {
    if(this.props.outgoingPlayers.length === 0) {
      return this.props.team.players;
    }

    let roster = _.cloneDeep(this.props.team.players);
    let outgoing = _.cloneDeep(this.props.outgoingPlayers);

    let result = _.filter(roster, (player) => {
      return _.find(outgoing, { 'name': player.name }) === undefined;
    });

    return result;
  }

  hasIncoming = () => {
    return this.props.incomingPlayers.length !== 0;
  }

  getSalary = (incoming) => {
    let players = incoming ? _.cloneDeep(this.props.incomingPlayers) : _.cloneDeep(this.props.outgoingPlayers);

    let salary = _.chain(players)
      .map((player) => {
        player.salary = player.salary.replace(/\,/g, '');
        player.salary = player.salary.slice(1);

        return parseInt(player.salary);
      })
      .reduce((sum, nextSalary) => {
        return sum + nextSalary;
      })
      .value();

    return '$' + salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getStyle = () => {
    let style = {
      position: 'absolute',
      top: 100,
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start'
    };

    switch(this.props.numTeams) {
      case 2:
        style.width = '40%';
        style.height = '550px';
        style.left = (this.props.index * 50 + 2) + '%';
        break;
      case 3:
        style.width = '28%';
        style.height = '700px';
        style.left = (this.props.index * 33 + 2) + '%';
        break;
      case 4:
        style.width = '24%';
        style.height = '800px';
        style.left = (this.props.index * 25) + '%';
        break;
    }

    return style;
  }

  getNonShrinkStyle = () => {
    return {
      flexBasis: '23px',
      width: '100%',
      flexShrink: 0,
      textShadow: '0 0 0 white',
      WebkitUserSelect: 'text',
      cursor: 'text',
      textAlign: 'center'
    };
  }

  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;

    const style = this.getStyle();
    const nonShrinkStyle = this.getNonShrinkStyle();

    let nonShrinkRedStyle = _.cloneDeep(nonShrinkStyle);
    nonShrinkRedStyle.color = 'red';

    let nonShrinkGreenStyle = _.cloneDeep(nonShrinkStyle);
    nonShrinkGreenStyle.color = 'green';

    let incomingSalary, outgoingSalary;
    let teamSalary = 'Team Salary: ' + this.props.team.totalSalary;

    if(this.props.incomingPlayers.length) {
      incomingSalary = '+ ' + this.getSalary(true);
    }
    if(this.props.outgoingPlayers.length) {
      outgoingSalary = '- ' + this.getSalary(false);
    }

    let players = this.rosterMinusOutgoing().concat(this.props.incomingPlayers);

    return connectDropTarget(
      <div style={style}>
        <div style={nonShrinkStyle}>
          <span>{teamSalary} </span>
          { incomingSalary ? <span style={nonShrinkGreenStyle}>{incomingSalary}</span> : <span></span> }
          { outgoingSalary ? <span style={nonShrinkRedStyle}>{outgoingSalary}</span> : <span></span> }
        </div>
        <PlayerList players={players} teamName={this.props.team.teamName} addPlayer={this.props.addPlayer} />
      </div>
    );
  }
}
