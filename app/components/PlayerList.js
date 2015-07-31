import React, { Component, PropTypes } from 'react';
import Player from './Player';

export default class PlayerList extends Component {

  static propTypes = {
    players: PropTypes.array.isRequired,
    teamName: PropTypes.string
  };

  render() {
    let style = {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexFlow: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    };

    return (
      <div style={style}>
        {
          this.props.players.map((player, index) => {
            if(this.props.teamName && !player.team) {
              player.team = this.props.teamName;
            }
            return (
              <Player
                key={index}
                player={player}
                name={player.name}
                salary={player.salary}
                imageUrl={player.imageUrl}
                teamName={player.team}
              />
            );
          })
        }
      </div>
    );
  }
}
