import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import Player from './Player';

export default class PlayerList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let style = {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    };

    return (
      <div style={style}>
        {
          this.props.roster.map((player, index) => {
            if(this.props.team) {
              player.team = this.props.team;
            }
            return (
              <Player
                key={index}
                player={player}
                name={player.name}
                salary={player.salary}
                imageUrl={player.imageUrl}
                teamName={player.team}
                onPlayerClicked={this.props.onPlayerClicked}
              />
            );
          })
        }
      </div>
    );
  }
}

PlayerList.propTypes = {
  roster: PropTypes.array.isRequired,
  team: PropTypes.string,
  onPlayerClicked: PropTypes.func.isRequired
};
