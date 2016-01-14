import { FETCH_NBA_DATA, SELECT_TEAM, ADD_TEAM, REMOVE_TEAM, ADD_PLAYER, REMOVE_PLAYER } from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  teams: [],
  selectedTeams: [],
  incomingPlayers: [[], []],
  outgoingPlayers: [[], []]
};

function getFirstTeamNotSelected(selectedTeams, teams) {
  let existingTeamNames = _.map(selectedTeams, (team) => team.teamName);

  let allTeamNames = _.chain(teams)
    .sortBy((team) => team.location)
    .map((team) => team.teamName)
    .filter((teamName) => {
      return _.findIndex(existingTeamNames, (name) => teamName === name) === -1;
    })
    .value();

  return teams[allTeamNames[0]];
}

function getEmptyArrays(selectedTeams) {
  return selectedTeams.map(() => {
    return [];
  });
}

/*function getTeamForPlayer(playerName, teams) {
  return _.compact(_.map(teams, (team, key) => {
    if(_.findIndex(team.players, 'name', playerName) !== -1) {
      return key;
    }
  }))[0];
}*/

export default function trades(state = initialState, action) {
  switch(action.type) {
    case FETCH_NBA_DATA:
      return {
        ...state,
        selectedTeams: [action.teams.Hawks, action.teams.Bucks],
        teams: action.teams
      };
    case SELECT_TEAM:
      let emptyArrays = getEmptyArrays(state.selectedTeams);
      let selectedTeams = _.cloneDeep(state.selectedTeams);
      selectedTeams[action.teamNumber] = state.teams[action.teamName];

      return {
        ...state,
        incomingPlayers: emptyArrays,
        outgoingPlayers: emptyArrays,
        selectedTeams
      };
    case ADD_TEAM:
      return {
        ...state,
        selectedTeams: state.selectedTeams.concat(getFirstTeamNotSelected(state.selectedTeams, state.teams)),
        incomingPlayers: state.incomingPlayers.concat([[]]),
        outgoingPlayers: state.outgoingPlayers.concat([[]])
      };
    case REMOVE_TEAM:
      if(state.selectedTeams.length <= 2) {
        return state;
      }

      return {
        ...state,
        selectedTeams: state.selectedTeams.filter((team, index) => action.teamNumber !== index),
        incomingPlayers: getEmptyArrays(state.selectedTeams),
        outgoingPlayers: getEmptyArrays(state.selectedTeams)
      };
    case ADD_PLAYER:
      const teamIndex = _.findIndex(state.selectedTeams, (team) => team.teamName === action.teamName);
      const playerTeamIndex = _.findIndex(state.selectedTeams, (team) => team.teamName === action.player.team);
      let incomingPlayers = _.cloneDeep(state.incomingPlayers);
      let outgoingPlayers = _.cloneDeep(state.outgoingPlayers);

      let alreadyAddedIndex = _.findIndex(state.incomingPlayers, (players) => {
        return _.reduce(players, (selected, existingPlayer) => {
          return (existingPlayer.name === action.player.name) ? true : selected;
        }, false);
      });

      if(alreadyAddedIndex !== -1) {
        if(alreadyAddedIndex === teamIndex) {
          // case where player is dragged to same place
          return state;
        }
        else {
          // player is being moved from one team to another
          const alreadyAddedPlayerIndex = _.findIndex(state.incomingPlayers[alreadyAddedIndex], (thePlayer) => {
            return thePlayer.name === action.player.name;
          });
          incomingPlayers[alreadyAddedIndex].splice(alreadyAddedPlayerIndex, 1);
        }
      }
    else {
      // max length of 15 players
      if(state.incomingPlayers[teamIndex].length === 15) {
        return state;
      }

      outgoingPlayers[playerTeamIndex].push(action.player);
    }

      incomingPlayers[teamIndex].push(action.player);

      return {
        ...state,
        incomingPlayers: incomingPlayers,
        outgoingPlayers: outgoingPlayers
      };
    case REMOVE_PLAYER:
      const thePlayerTeamIndex = _.findIndex(state.selectedTeams, (team) => team.teamName === action.player.team);
      const outgoingPlayerIndex = _.findIndex(state.outgoingPlayers[thePlayerTeamIndex], (outgoingPlayer) => action.player.name === outgoingPlayer.name);
      let incomingPlayerIndex;
      const incomingTeamIndex = _.findIndex(state.incomingPlayers, (players) => {
        return _.reduce(players, (selected, existingPlayer, index) => {
          if(existingPlayer.name === action.player.name) {
            incomingPlayerIndex = index;
            return true;
          }
          return false;
        }, false);
      });

      if(outgoingPlayerIndex !== -1) {
        return {
          ...state,
          incomingPlayers: state.incomingPlayers.map((team) => {
            return team.filter(player => player.name !== action.player.name);
          }),
          outgoingPlayers: state.outgoingPlayers.map((team) => {
            return team.filter(player => player.name !== action.player.name);
          })
        };
      }
    else {
      return state;
    }
    break;
    default:
      return state;
  }
}
